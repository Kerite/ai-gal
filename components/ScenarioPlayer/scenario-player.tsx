"use client"
import { useScenario } from "@/lib/scenario-provider";
import { ImageTextScene } from "../ImageTextScene/image-text-scene";
import VideoScene from "../VideoScene/video-scene";
import { useEffect } from "react";

export default function ScenarioPlayer({ scenarioId }: { scenarioId: string }) {
  const { scenario, currentSceneIndex, loadScenario } = useScenario();

  useEffect(() => {
    console.log("Loading scenario", scenarioId)
    loadScenario(scenarioId);
  }, [scenarioId, loadScenario])

  return (
    <div>
      {
        scenario?.scenes?.map((scene, sceneIndex) => {
          const componentKey = `${scenario.id}-${sceneIndex}`;
          if (sceneIndex != currentSceneIndex) {
            return (<div key={componentKey}></div>)
          }
          if (scene.type === "image-text") {
            return (
              <ImageTextScene key={componentKey} scene={scene}></ImageTextScene>
            )
          } else if (scene.type === "video") {
            return (
              <VideoScene key={componentKey} url={scene.url} active={currentSceneIndex == sceneIndex}></VideoScene>
            )
          }
        }) ?? <div>Null Scenario</div>
      }
    </div>
  )
}
