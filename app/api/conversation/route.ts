import { Conversation, ConversationContent } from "@/lib/types";
import { NextRequest } from "next/server";
import { hashIds, loadCharacterMapping, loadConversationForScene } from "@/lib/db";

async function loadConversation(sceneId: string): Promise<Conversation> {
  const realSceneId = Number(hashIds.decode(sceneId)[0]?.valueOf());
  console.log("Loading conversation for scene", realSceneId);

  const conversation = await loadConversationForScene(realSceneId);
  const characterMapping = await loadCharacterMapping(realSceneId);

  return {
    characters: Object.values(characterMapping),
    sentences: conversation.map((chat): ConversationContent => {
      console.log("Speaker", chat.speaker);
      return {
        speaker: characterMapping[chat.speaker].id ?? chat.speaker,
        content: chat.content,
        image_override: chat.image_override
      }
    }),
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const scenarioId = params.get("id");
  if (scenarioId) {
    const scenario = await loadConversation(scenarioId);
    return Response.json(scenario);
  }
  return Response.json({}, {
    status: 404,
    statusText: `Scenario With Id ${scenarioId} Not Found`
  });
}
