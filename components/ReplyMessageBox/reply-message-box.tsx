"use client";

export interface ReplyMessageBoxProps {
  reply: {
    reply: string;
    translation: string;
  };
  characterId: string;
  className?: string;
}

export function ReplyMessageBox({ reply, className }: ReplyMessageBoxProps) {
  return (
    <div className={`${className}`}>
      <div id="reply-bubble" className="relative rounded-[20px] border-[#A55D4F] border-[2px] p-[20px] bg-[#FDF1EA] mt-[50px]">
        <div id="name-tag" className="absolute" />
        <div>{reply.reply}</div>
        <div className="text-sm text-gray-500">{reply.translation}</div>
      </div>
    </div>
  )
}
