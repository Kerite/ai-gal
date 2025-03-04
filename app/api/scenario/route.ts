import { Scenario } from "@/lib/types";
import { NextRequest } from "next/server";
import { loadScenesForScenario, hashIds } from "@/lib/db";

async function getScenario(scenarioId: string): Promise<Scenario> {
  const scenes = await loadScenesForScenario(Number(hashIds.decode(scenarioId)[0].valueOf()));
  console.log("Scenes for id", scenarioId, scenes);
  return {
    id: scenarioId,
    scenes: scenes,
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams;
  const scenarioId = params.get("id");
  if (scenarioId) {
    const scenario = await getScenario(scenarioId);
    return Response.json(scenario);
  }
  return Response.json({}, {
    status: 404,
    statusText: `Scenario With Id ${scenarioId} Not Found`
  });
}
