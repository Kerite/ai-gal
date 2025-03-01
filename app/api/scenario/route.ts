import { Scenario } from "@/lib/types";
import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

async function loadScenario(scenarioId: string): Promise<Scenario> {
  console.log("Loading SceloadScenarionario", scenarioId);
  const file = await readFile(path.resolve(process.cwd(), 'configs/scenarios', `${scenarioId}.json`), 'utf-8');
  const data = JSON.parse(file);
  console.log("Scenario", scenarioId, "data:", data)

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
