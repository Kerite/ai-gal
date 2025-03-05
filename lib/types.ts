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

export interface AiChat {
  // For sending message to /api/chat
  id: string;
  // For displaying the character
  character: Character;
}

export interface VideoScene {
  id: string;
  type: "video";
  url: string;
}

export interface ImageTextScene {
  id: string;
  type: "image-text";
  background: string[];
  chats: AiChat[];
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
