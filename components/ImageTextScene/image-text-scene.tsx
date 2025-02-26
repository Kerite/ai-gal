"use client";

import { ImageTextScene as ImageTextSceneDef } from "@/lib/configs";
import { useScenario } from "@/lib/scenario-provider";

export function ImageTextScene({ }: { scene: ImageTextSceneDef }) {
  const { scenario } = useScenario();

  return (
    <div className="w-full h-full">
      <div>{scenario?.id ?? "Load Scenario Error"}</div>
    </div>
  )
}