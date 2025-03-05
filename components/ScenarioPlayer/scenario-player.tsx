"use client"
import { useScenario } from "@/lib/scenario-provider";
import { ImageTextScene } from "../ImageTextScene/image-text-scene";
import { VideoScene } from "../VideoScene/video-scene";
import { useEffect, useState } from "react";
import { Scene } from "@/lib/types";
import Chat from "../Chat/chat";

export default function ScenarioPlayer({ scenarioId }: { scenarioId: string }) {
  const { scenario, currentSceneIndex, loadScenario } = useScenario();
  const [currentScene, setCurrentScene] = useState<Scene>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loading scenario", scenarioId);
    setLoading(true);
    loadScenario(scenarioId).then(() => { setLoading(false) });
  }, [scenarioId, loadScenario])

  useEffect(() => {
    setCurrentScene(scenario?.scenes[currentSceneIndex]);
  }, [currentSceneIndex, scenario])

  useEffect(() => {
    console.log("Current Scene", currentSceneIndex, "/", scenario?.scenes.length, currentScene)
  }, [currentSceneIndex, scenario, currentScene])

  return (
    <div id="scenario-player" className="w-full h-full flex flex-col">
      {
        loading && <span>Loading...</span>
      }
      {
        !loading && scenario?.scenes.length == currentSceneIndex && <span>Finished</span>
      }
      {
        currentScene && (
          currentScene.type === "image-text" ?
            (currentScene.chats.length > 0 ? <Chat currentScene={currentScene} /> : <ImageTextScene scene={currentScene} />)
            :
            <VideoScene url={currentScene.url} />
        )
      }
    </div >
  )
}
