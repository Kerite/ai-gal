"use client";
import { useState } from "react";
import Image, { getImageProps } from "next/image";
import { MessageInput } from "@/components/MessageInput/message-input";
import { LastSendMessageBox } from "@/components/LastSendMessageBox/last-send-message-box";
import { ReplyMessageBox } from "@/components/ReplyMessageBox/reply-message-box";
import { getBackgroundImage } from "@/lib/helper";
import { ImageTextScene } from "@/lib/types";

export default function Chat({ currentScene }: { currentScene: ImageTextScene }) {
  const [lastMessage, setLastMessage] = useState("");
  const [lastReply, setLastReply] = useState({
    reply: "",
    translation: ""
  });

  const handleSendMessage = async (message: string) => {
    setLastMessage(message);
    setLastReply({ reply: "(考え...)", translation: "(Thinking...)" });
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        chatId: currentScene.chats[0].id,
        message,
      })
    });
    console.log(`User sent: ${message}`);
    const data = await response.json();
    console.log(data);
    setLastReply(data.data);
  }

  return (
    <div className="h-full w-full bg-cover bg-center bg-no-repeat flex" style={{
      backgroundImage: getBackgroundImage(getImageProps({
        height: 1080,
        width: 1920,
        src: currentScene.background[0] ?? "",
        alt: "Background Image"
      }).props.srcSet)
    }}>
      <div className="flex-row flex left-0 right-0 max-h-screen overflow-hidden mx-auto" id="chat-container">
        <div className="w-[24rem] m-10">
          <Image className="w-[24rem]"
            src={currentScene.chats[0].character.image}
            alt="character"
            width={565}
            height={800} />
        </div>
        <div id="right-container" className="space-y-[40px] flex flex-col h-[calc(100vh-80px)] max-w-[794px]">
          <div className="flex-grow">
            <ReplyMessageBox reply={lastReply} characterId="zhenxiao" />
          </div>
          <LastSendMessageBox message={lastMessage} className="mr-0 ml-auto flex" />
          <MessageInput onSend={(message) => handleSendMessage(message)} />
        </div>
      </div>
    </div>
  );
}
