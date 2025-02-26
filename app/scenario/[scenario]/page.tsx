import ScenarioPlayer from "@/components/ScenarioPlayer/scenario-player";

export default async function ScenarioPlayerWrapper({
  params
}: {
  params: Promise<{ scenario: string }>
}) {
  return (
    <ScenarioPlayer scenarioId={(await params).scenario} />
  )
}