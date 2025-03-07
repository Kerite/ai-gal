import { Character } from "../types";

export interface CharacterNameMapping {
  [conversationDisplayedName: string]: Character;
}