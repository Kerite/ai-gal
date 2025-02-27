"use client";
import { useScenario } from "@/lib/scenario-provider";
import { useRef } from "react";

export interface VideoSceneProps {
  url: string;
}

export function VideoScene({ url }: VideoSceneProps) {
  const { nextScene } = useScenario();
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSceneFinished = () => {
    nextScene();
  }

  return (
    <div className="w-full h-full">
      <button onClick={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = videoRef.current.duration - 10;
        }
      }}>Jump to end</button>
      <video autoPlay onEnded={() => { onSceneFinished(); }} ref={videoRef} >
        <source src={url} />
      </video>
    </div>
  )
}