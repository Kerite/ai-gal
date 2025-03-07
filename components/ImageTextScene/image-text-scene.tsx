"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import Image, { getImageProps } from "next/image";
import { getBackgroundImage } from "@/lib/helper";
import { useScenario } from "@/lib/scenario-provider";
import { Conversation, ConversationContent, ImageTextScene as ImageTextSceneDef } from "@/lib/types";

interface ImageTextSceneState {
  backgroundImage: string;
  leftImageUrl: string;
  rightImageUrl: string;
  currentImage: "none" | "left" | "right";
  conversation: Conversation;
  currentSentenceIndex: number;
  currentSentence?: ConversationContent;
  prevSentence?: ConversationContent;
  finished: boolean;
}

type ImageTextSceneAction = { type: "NEXT_SENTENCE" }
  | { type: "UPDATE_SCENE", scene: ImageTextSceneDef, conversation: Conversation };

function imageTextSceneReducer(state: ImageTextSceneState, action: ImageTextSceneAction): ImageTextSceneState {
  switch (action.type) {
    case "NEXT_SENTENCE":
      {
        if (state.currentSentenceIndex === state.conversation.sentences.length - 1 || state.conversation.sentences.length === 0) {
          console.log("Finished Scene");
          return { ...state, finished: true };
        } else {
          const newState: ImageTextSceneState = {
            ...state,
            currentImage: state.currentImage === "right" ? "left" : "right",
            currentSentenceIndex: state.currentSentenceIndex + 1,
            currentSentence: state.conversation.sentences[state.currentSentenceIndex + 1],
            leftImageUrl: state.currentImage === "right" ? state.conversation.characters.find(x => {
              return x.id === state.conversation.sentences[state.currentSentenceIndex + 1]?.speaker
            })?.image ?? "" : state.leftImageUrl,
            rightImageUrl: state.currentImage === "left" ? state.conversation.characters.find(x => {
              return x.id === state.conversation.sentences[state.currentSentenceIndex + 1]?.speaker
            })?.image ?? "" : state.rightImageUrl,
          };
          // console.log("New State:", newState);
          return newState;
        }
      }
    case "UPDATE_SCENE":
      const newState: ImageTextSceneState = {
        backgroundImage: getBackgroundImage(getImageProps({
          src: action.scene.background[0] ?? "",
          fill: true,
          alt: "Background Image"
        }).props.srcSet),
        currentSentenceIndex: 0,
        currentSentence: action.conversation.sentences[0],
        currentImage: "left",
        conversation: action.conversation,
        leftImageUrl: action.conversation.characters.find(x => {
          return x.id === action.conversation.sentences[0]?.speaker
        })?.image ?? "",
        rightImageUrl: "",
        finished: false,
      };
      // console.log("New State:", newState);
      return newState;
  }
}

export function ImageTextScene({ scene }: { scene: ImageTextSceneDef }) {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(imageTextSceneReducer, {
    backgroundImage: getBackgroundImage(getImageProps({
      src: scene.background[0] ?? "",
      width: 1920,
      height: 1080,
      alt: "Background Image"
    }).props.srcSet),
    currentImage: "none",
    leftImageUrl: "",
    rightImageUrl: "",
    conversation: {
      characters: [],
      sentences: []
    },
    currentSentenceIndex: 0,
    finished: false,
  });
  const { nextScene } = useScenario();

  useEffect(() => {
    const fetchData = async () => {
      if (scene.conversation) {
        const res = await fetch(`/api/conversation?id=${scene.conversation}`);
        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "UPDATE_SCENE", scene, conversation: data });
        } else {
          console.error("Failed to fetch conversation", res.statusText);
        }
      }
    };
    setLoading(true);
    fetchData().then(() => setLoading(false));
  }, [scene]);

  const getCurrentConversation = useCallback(() => {
    return state.conversation.sentences[state.currentSentenceIndex];
  }, [state.currentSentenceIndex, state.conversation]);

  const nextSentence = () => {
    dispatch({ type: "NEXT_SENTENCE" });
    if (state.finished) {
      nextScene();
    }
  }

  const getImageComponent = (imageUrl: string, isCurrent: boolean) => {
    return (
      <div className={isCurrent ? "border-2 border-black" : ""}>
        <Image className="select-none" src={imageUrl} width={400} height={600} alt="Character" />
      </div>
    );
  }

  return (
    <div className={`image-text-scene w-full h-full flex flex-col-reverse bg-cover`} style={{
      backgroundImage: state.backgroundImage
    }}>
      <div className="flex flex-row mx-auto">
        <div className="w-[20rem] flex-grow-0 mt-auto mb-10" id="left-character">
          {
            state.leftImageUrl === "" ?
              <div></div>
              :
              getImageComponent(state.leftImageUrl, state.currentImage === "left")
          }
        </div>
        <div className={`w-[34rem] mt-auto p-10`} onClick={() => { nextSentence() }}>
          <div className="border-1 border-black bg-slate-400 p-1 select-none">
            {
              loading ? "Loading..." :
                state.conversation.characters.find(character => {
                  return character.id === (state.currentSentence ?? { speaker: "" }).speaker
                })?.name ?? state.currentSentence?.speaker ?? "No Name"
            }
          </div>
          <div className="border-1 border-black bg-slate-300 p-3 select-none">
            {getCurrentConversation()?.content}
          </div>
        </div>
        <div className="w-[20rem] flex-grow-0 mt-auto mb-10" id="right-character">
          {
            state.rightImageUrl === "" ?
              <div></div>
              :
              getImageComponent(state.rightImageUrl, state.currentImage === "right")
          }
        </div>
      </div>
    </div>
  )
}
