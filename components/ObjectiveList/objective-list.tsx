import { useScenario } from "@/lib/scenario-provider"

export default function ObjectiveList({ className = "" }: { className?: string }) {
  const { objectives } = useScenario();
  return (
    <div className={`flex flex-col gap-2 bg-slate-300 p-2 rounded-lg ${className}`}>
      {
        objectives?.map(objective => (
          <div key={objective.id}>
            <span>{objective.completed ? " ✔️" : " ❌"}</span>
            <span>{objective.description}</span>
          </div>
        ))
      }
    </div>
  )
}