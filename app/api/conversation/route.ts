import { Conversation } from "@/lib/configs";
import { NextRequest } from "next/server";
import { readFile } from "fs/promises";

export async function loadScenario(conversationId: string): Promise<Conversation> {
  console.log("Loading conversation:", conversationId);
  const file = await readFile(process.cwd() + '/configs/conversations/' + conversationId + ".json", 'utf-8');
  const data = JSON.parse(file);
  console.log("Loaded conversation", conversationId, "data:", data)

  return data;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const scenarioId = params.get("id");
  if (scenarioId) {
    const scenario = await loadScenario(scenarioId);
    return Response.json(scenario);
  }
  return Response.json({}, {
    status: 404,
    statusText: `Scenario With Id ${scenarioId} Not Found`
  });
}
