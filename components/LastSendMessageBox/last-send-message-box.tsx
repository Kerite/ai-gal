interface LastSendMessageBoxProps {
  message: string;
  className?: string;
}

export function LastSendMessageBox({ message, className }: LastSendMessageBoxProps) {
  return (
    <div className={`flex flex-col w-full justify-end space-y-[20px] ${className}`}>
      <div className="flex w-full">
        <button className="ml-auto w-[122px] h-[34px] rounded-[50px] bg-[rgba(255,255,255,0.7)]">
          <span className="font-normal text-[#666666] text-[16px]">More&nbsp;Records</span>
        </button>
      </div>
      <div className="w-full p-[40px] rounded-[15px]" style={{
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)"
      }}>
        <span className="font-bold text-[26px]" style={{
          "letterSpacing": "0em"
        }}>
          {message}
        </span>
      </div>
    </div>
  )
}