import { Scenario } from "@/lib/types";
import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

async function loadScenarioList(): Promise<Scenario> {
  const file = await readFile(path.resolve(process.cwd(), 'configs/scenario.json'), 'utf-8');
  const data = JSON.parse(file);

  return data;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const scenarioId = params.get("id");
  if (scenarioId) {
    const scenario = await loadScenarioList();
    return Response.json(scenario);
  }
  return Response.json({}, {
    status: 404,
    statusText: `Scenario With Id ${scenarioId} Not Found`
  });
}
