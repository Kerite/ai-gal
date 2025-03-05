"use client";
import { useRef } from "react";
import { useScenario } from "@/lib/scenario-provider";

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
      <video autoPlay onEnded={() => { onSceneFinished(); }} ref={videoRef} >
        <source src={url} />
      </video>
      <button onClick={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = videoRef.current.duration;
        }
      }}>Skip</button>
    </div>
  )
}