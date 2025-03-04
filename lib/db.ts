import postgres from "postgres";
import { Character, ConversationContent, Scene } from "./types";
import Hashids from "hashids";
import { extractConversation } from "./conversation-utils";
const sql = postgres(process.env.DATABASE_DATABASE_URL!, { ssl: 'verify-full' });
const hashIds = new Hashids(process.env.HASHIDS_SALT, 6);

interface CharacterMapping {
  [conversationDisplayedName: string]: Character;
}

const loadCharacterMapping = async (sceneId: number): Promise<CharacterMapping> => {
  const sceneCharacters = await sql`
    SELECT
      sc.name AS scene_character_name, sc.character_id, c.name, c.alias, c.image
    FROM
      scene_character AS sc
    LEFT JOIN
      characters AS c
    ON
      sc.character_id = c.id
    WHERE
      scene_id = ${sceneId}`;
  const characterMapping: CharacterMapping = {};
  sceneCharacters.forEach(character => {
    characterMapping[character.scene_character_name] = {
      id: hashIds.encode(character.character_id),
      name: character.name,
      alias: character.alias,
      image: character.image
    };
  });
  console.log("Character mapping", characterMapping);
  return characterMapping;
}

const loadScenarioList = async () => {
  const scenariosPromise = sql`SELECT id, image, name, description FROM scenarios`;
  const scenarios = await scenariosPromise;
  return scenarios.map(scenario => ({
    id: hashIds.encode(scenario.id),
    image: scenario.image,
    name: scenario.name,
    description: scenario.description
  }));
}

const loadScenesForScenario = async (scenarioId: number): Promise<Scene[]> => {
  const scenes = await sql`
    SELECT
      s.id,
      s.type,
      s.chat,
      s.background
    FROM
      scenes AS s
    WHERE
      scenario_id = ${scenarioId}
    ORDER BY
      s.id ASC
  `;
  console.log("Scenes for scenario", scenarioId, scenes);
  return scenes.map((scene): Scene => {
    if (scene.type === "video") {
      return {
        type: "video",
        url: scene.background[0],
      };
    } else if (scene.type === "image-text") {
      return {
        type: "image-text",
        background: scene.background,
        chat: scene.chat,
        conversation: hashIds.encode(scene.id)
      }
    } else {
      throw new Error(`Unknown scene type: ${scene.type}`);
    }
  });
}

const loadConversationForScene = async (sceneId: number): Promise<ConversationContent[]> => {
  const rawConversation = await sql`
    SELECT
      s.conversation_raw
    FROM
      scenes AS s
    WHERE
      id = ${sceneId}
  `
  console.log("Raw conversation", rawConversation);
  if (rawConversation.length > 0 && rawConversation[0]?.conversation_raw) {
    const conversation_raw: string = rawConversation[0]?.conversation_raw;
    console.log("Conversation raw", conversation_raw);

    if (conversation_raw.startsWith("http")) {
      console.log("Fetching conversation from URL", conversation_raw);
      const response = await fetch(conversation_raw);
      const conversation = await response.text();
      return (await extractConversation(conversation));
    } else {
      return (await extractConversation(conversation_raw));
    }
  }
  const chats = await sql`
    SELECT
      c.id,
      c.speaker,
      c.image_override,
      c.content
    FROM
      chats AS c
    WHERE
      scene = ${sceneId}
  `;
  return chats.map(chat => ({
    id: chat.id,
    speaker: chat.speaker,
    image_override: chat.image_override,
    content: chat.content
  }));
}

export { loadScenarioList, loadScenesForScenario, loadConversationForScene, loadCharacterMapping, hashIds };
