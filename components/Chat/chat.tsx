"use client";
import { useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion } from "motion/react";

import ChatRecords, { ChatRecord } from "@/components/ChatRecords/chat-records";
import { MessageInput } from "@/components/MessageInput/message-input";
import { LastSendMessageBox } from "@/components/LastSendMessageBox/last-send-message-box";
import { ReplyMessageBox } from "@/components/ReplyMessageBox/reply-message-box";
import { getBackgroundImage } from "@/lib/helper";
import { ApiChatResponse, ImageTextScene } from "@/lib/types";
import { useScenario } from "@/lib/scenario-provider";
import ObjectiveList from "../ObjectiveList/objective-list";
import NextSceneButton from "../NextSceneButton/next-scene-button";

export default function Chat({ currentScene }: { currentScene: ImageTextScene }) {
  const { nextScene, jumpToScene, markObjectiveCompleted, objectives } = useScenario();
  const [showMoreRecords, setShowMoreRecords] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [records, setRecords] = useState<ChatRecord[]>([]);
  const [lastReply, setLastReply] = useState({
    reply: "",
    translation: ""
  });

  const handleSendMessage = async (message: string) => {
    setLastMessage(message);
    setLastReply({ reply: "(考え...)", translation: "(Thinking...)" });
    setRecords([...records,]);
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        chatId: currentScene.chats[0].id,
        message,
      })
    });
    console.log(`User sent: ${message}`);
    const { data }: ApiChatResponse = await response.json();
    console.log(data);
    if (data.actions.length !== 0) {
      console.log("[action] Objective completed:", data.actions[0]);
      if (data.actions[0].startsWith("complete-objective")) {
        const objectiveId = data.actions[0].split(" ")[1];
        console.log("[action] Complete objective:", objectiveId);
        markObjectiveCompleted(objectiveId);
      }
      if (data.actions[0].startsWith("jump-scene")) {
        const targetScene = data.actions[0].split(" ")[1];
        console.log("[action] Jump to scene:", targetScene);
        jumpToScene(Number(targetScene));
        return;
      } else if (data.actions[0].startsWith("next-scene")) {
        console.log("[action] Next scene");
        nextScene();
        return;
      }
    }
    setRecords([
      ...records,
      { speaker: "user", message },
      { speaker: data.characterId, message: data.reply }
    ]);
    setLastReply(data);
  }

  useEffect(() => {
    let allCompleted = true;
    if (objectives.length === 0) {
      return;
    }
    objectives.forEach(objective => {
      if (!objective.completed) {
        allCompleted = false;
      }
    });
    if (allCompleted) {
      console.log("[action] All objectives completed, jumping to next scene");
      setFinished(true);
    }
  }, [nextScene, objectives]);

  return (
    <div className="h-full w-full bg-cover bg-center bg-no-repeat relative" style={{
      backgroundImage: getBackgroundImage(getImageProps({
        height: 1080,
        width: 1920,
        src: currentScene.background[0] ?? "",
        alt: "Background Image"
      }).props.srcSet)
    }} id="chat-root">
      <div id="objectives-container" className="absolute left-3 top-3 z-10">
        <ObjectiveList />
      </div>
      <div className="flex flex-row justify-center items-start w-full max-h-screen overflow-hidden" id="chat-container">
        <div className="w-[24rem] m-10">
          <Image className="w-[24rem] select-none"
            src={currentScene.chats[0].character.image}
            alt="character"
            width={565}
            height={800} />
        </div>
        <div id="right-container" className="space-y-[40px] flex flex-col h-[calc(100vh-80px)] max-w-[794px]">
          <div className="flex-grow">
            {
              !showMoreRecords && <ReplyMessageBox reply={lastReply} characterId={currentScene.chats[0].character.id} />
            }
          </div>
          <div key="show-more" className="flex w-full justify-end space-x-2">
            {
              finished && <NextSceneButton />
            }
            <button className="w-[122px] h-[34px] rounded-[50px] bg-[rgba(255,255,255,0.7)]" onClick={() => setShowMoreRecords(!showMoreRecords)}>
              <span className="font-normal text-[#666666] text-[16px]">
                {
                  showMoreRecords ? "Less" : "More"
                }
                &nbsp;Records
              </span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={showMoreRecords ? "records" : "lastMessage"}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2 }}>
              {
                showMoreRecords ?
                  <ChatRecords records={records} characters={currentScene.characters} /> :
                  <LastSendMessageBox message={lastMessage} className="mr-0 ml-auto flex" />
              }
            </motion.div>
          </AnimatePresence>
          <MessageInput onSend={(message) => handleSendMessage(message)} />
        </div>
      </div>
    </div>
  );
}
