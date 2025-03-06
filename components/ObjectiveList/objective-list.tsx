interface ObjectiveItem {
  id: string;
  description: string;
  completed: boolean;
}

export default function ObjectiveList({
  objectives
}: {
  objectives: ObjectiveItem[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {
        objectives.map(objective => (
          <div key={objective.id}>
            <span>{objective.completed ? " ✔️" : " ❌"}</span>
            <span>{objective.description}</span>
          </div>
        ))
      }
    </div>
  )
}