export interface ScenarioSummary {
  id: string;
  image: string;
  name: string;
  description: string;
}

export interface Scenario {
  id: string;
  scenes: Scene[]
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

export type Scene = VideoScene | ImageTextScene;

export interface Character {
  id: string;
  name: string;
  alias: string[];
  image: string;
}


export interface Conversation {
  sentences: ConversationContent[];
  characters: Character[];
}

export interface ConversationContent {
  speaker: string;
  content: string;
  image_override?: string;
}
