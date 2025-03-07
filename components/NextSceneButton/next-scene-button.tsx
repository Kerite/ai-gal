import { useScenario } from "@/lib/scenario-provider";

export default function NextSceneButton({ className = "" }: { className?: string }) {
  const { nextScene } = useScenario();
  return (
    <div className={`rounded-[50px] bg-[rgba(255,255,255,0.7)] ${className}`}>
      <button className="flex justify-center items-center w-full h-full py-1 px-4" onClick={nextScene}>
        <span className="font-normal text-[#666666] text-[16px]">
          Next&nbsp;Scene
        </span>
      </button>
    </div>
  )
}