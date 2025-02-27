export interface Scenario {
  id: string;
  scenes: (VideoScene | ImageTextScene)[]
}

export interface VideoScene {
  type: "video";
  url: string;
}

export interface ImageTextScene {
  type: "image-text";
  background: { url: string }[];
  chat: boolean;
  conversation?: string;
  systemPrompt?: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
}

export type Scene = VideoScene | ImageTextScene;

export interface Conversation {
  conversation: ConversationContent[];
}

export interface ConversationContent {
  speaker: string;
  text: string;
  image?: string;
}
