"use client";
import { MessageInput } from "@/components/MessageInput/message-input";
import { LastSendMessageBox } from "@/components/LastSendMessageBox/last-send-message-box";
import { useState } from "react";
import { ReplyMessageBox } from "@/components/ReplyMessageBox/reply-message-box";

export default function Chat() {
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
      body: JSON.stringify({ message })
    });
    console.log(`User sent: ${message}`);
    const data = await response.json();
    console.log(data);
    setLastReply(data.data);
  }

  return (
    <div className="bg-[url(../public/bg-home.png)] h-screen w-screen bg-cover bg-center bg-no-repeat flex">
      <div id="chat-container" className="flex-row flex left-0 right-0 max-h-screen overflow-hidden">
        <div className="max-w-[565px] max-h-[800px]">
          {/* <Image src={character} alt="character" className="w-[565px] h-[800px]" width={565} height={800} /> */}
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
