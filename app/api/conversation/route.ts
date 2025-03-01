import { Conversation } from "@/lib/types";
import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { extractConversation } from "@/lib/conversation-utils";
import path from "path";

async function loadConversation(conversationId: string): Promise<Conversation> {
  console.log("Loading conversation:", conversationId);

  if (conversationId === "test") {
    const testConversation = await fetch(process.env.TEST_CONVERSATION_URL!);
    const text = await testConversation.text();
    const data = await extractConversation(text);
    console.log("Loaded conversation", conversationId, "data:", data);
    return data;
  } else {
    const file = await readFile(path.resolve(process.cwd(), 'configs/conversations', `${conversationId}.json`), 'utf-8');
    const data = JSON.parse(file);
    console.log("Loaded conversation", conversationId, "data:", data);
    return data;
  }
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
