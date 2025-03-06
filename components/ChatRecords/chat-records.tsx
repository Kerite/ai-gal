import { Character } from "@/lib/types";

export interface ChatRecord {
  speaker: string,
  message: string,
}

export interface ChatRecordsProps {
  records: ChatRecord[];
  characters: {
    [characterId: string]: Character;
  }
}

export default function ChatRecords({ records, characters }: ChatRecordsProps) {
  return (
    <div className="flex flex-col w-full space-y-3 p-[40px] rounded-[15px]" style={{
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)"
    }}>
      {
        records.map((record, index) => {
          return (
            <div key={`chat-${index}`}>
              <div className="flex flex-col">
                <span>
                  {
                    record.speaker === "user" ? "You" :
                      characters[record.speaker]?.name ?? "<name>"
                  }:
                </span>
                <span>{record.message}</span>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}