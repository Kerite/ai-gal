import { ConversationContent } from "./types";

export async function extractConversation(text: string, split: string | RegExp = /[:：]/): Promise<ConversationContent[]> {
  const conversation: ConversationContent[] = [];
  let currentConversation: ConversationContent | null = null;

  text.split("\n").forEach(line => {
    const trimmedLine = line.trim().replace(/^"|"$/g, "");
    console.log("Trimmed line:", trimmedLine);
    if (trimmedLine.length === 0 || trimmedLine === '"') {
      return;
    }
    if (trimmedLine.match(/.*[:：].*/) || currentConversation === null) {
      const [speaker, content] = trimmedLine.split(split);
      if (currentConversation) {
        conversation.push({
          ...currentConversation
        })
      }
      currentConversation = {
        speaker: speaker.trim().replace(/^"|"$/g, ""),
        content: content.trim().replace(/^"|"$/g, ""),
      }
    } else if (currentConversation) {
      currentConversation.content += "\n" + trimmedLine;
    } else {
      currentConversation = {
        speaker: "ERROR",
        content: trimmedLine,
      }
    }
  });
  if (currentConversation) {
    conversation.push(currentConversation);
  }

  return conversation;
};