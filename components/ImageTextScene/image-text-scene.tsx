"use client";
import { Conversation, ImageTextScene as ImageTextSceneDef } from "@/lib/configs";
import { useEffect, useState } from "react";

export function ImageTextScene({ scene }: { scene: ImageTextSceneDef }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (scene.conversation) {
        const res = await fetch(`/api/conversation?id=${scene.conversation}`);
        const data = await res.json();
        if (res.ok) {
          setConversation(data);
        } else {
          console.error("Failed to fetch conversation", res.statusText);
        }
      }
    };
    fetchData();
  }, [scene])

  return (
    <div className="w-full h-full" onClick={() => { setCurrentConversationIndex(currentConversationIndex + 1) }}>
      <div>{conversation?.conversation[currentConversationIndex]?.text}</div>
    </div>
  )
}
