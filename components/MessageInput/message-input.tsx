"use client";
import { useState } from "react";
import SendIcon from "./send-icon.svg";
import Image from "next/image";

export interface MessageInputProps {
  onSend?: (message: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="rounded-[50px] h-[90px] w-[794px] bg-white p-[10px] border-[2px] border-[#A55D4F] opacity-1">
      <div className="flex rounded-[40px] border-[2px] border-[#F8DED9] h-full w-full">
        <input placeholder="Message..." type="text" onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onSend?.(message)
            setMessage("");
          }
        }} className="ml-[40px] flex-grow focus:outline-none" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="aspect-square bg-[#26C6C6] rounded-full m-[8px]" onClick={() => onSend?.(message)}>
          <Image src={SendIcon} alt="SendMessage" className="m-auto" />
        </button>
      </div>
    </div>
  )
}
