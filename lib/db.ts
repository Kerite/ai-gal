"use server";

import postgres from "postgres";
import { Scene } from "./types";
const sql = postgres(process.env.DATABASE_DATABASE_URL!, { ssl: 'verify-full' });

const loadScenarioList = async () => {
  const scenariosPromise = sql`SELECT id, image, name, description FROM scenarios`;
  const scenarios = await scenariosPromise;
  return scenarios;
}

const loadScenesForScenario = async (scenarioId: number): Promise<Scene[]> => {
  const scenes = await sql`
    SELECT
      s.id,
      s.type,
      s.chat
    FROM
      scenes AS s
    WHERE
      scenario_id = ${scenarioId}
  `;
  return scenes.map(scene => {
    if (scene.type === "video") {
      return {
        type: "video",
        url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      };
    } else if (scene.type === "image-text") {
      return {
        type: "image-text",
        background: [],
        chat: scene.chat
      }
    } else {
      throw new Error(`Unknown scene type: ${scene.type}`);
    }
  });
}

const loadConversationForScene = async (sceneId: number): Promise<{
  id: number;
  speaker: string;
  image_override: string;
  content: string;
}[]> => {
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

export { loadScenarioList, loadScenesForScenario, loadConversationForScene };
