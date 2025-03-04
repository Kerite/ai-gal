import { loadScenarioList } from "@/lib/db";

export async function GET() {
  const scenario = await loadScenarioList();
  console.log("Scenario list:", scenario);
  return Response.json(scenario);
}
