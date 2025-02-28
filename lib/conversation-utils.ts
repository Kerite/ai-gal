import { readFile } from "fs/promises";
import { Character, Conversation, ConversationContent } from "./types";

export async function extractConversation(text: string, split: string | RegExp = /[:：]/): Promise<Conversation> {
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
        text: content.trim().replace(/^"|"$/g, ""),
      }
    } else if (currentConversation) {
      currentConversation.text += "\n" + trimmedLine;
    } else {
      currentConversation = {
        speaker: "ERROR",
        text: trimmedLine,
      }
    }
  });
  if (currentConversation) {
    conversation.push(currentConversation);
  }

  const characterJson = await readFile(process.cwd() + "/configs/character.json", "utf-8");
  const characterData = JSON.parse(characterJson) as {
    characters: Character[]
  };

  const characterSet = new Set<string>();
  conversation.forEach(conversation => {
    characterSet.add(conversation.speaker);
  });
  const characters = [...characterSet].map((character, index) => ({
    id: "character-" + index,
    alias: [],
    name: character,
  }));

  return {
    characters: characterData.characters,
    sentences: conversation.map((conversationItem) => ({
      ...conversationItem,
      speaker: characters.find(character => character.name === conversationItem.speaker)?.id || conversationItem.speaker,
    })),
  };
};