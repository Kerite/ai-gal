"use client";
import { Conversation, ConversationContent, ImageTextScene as ImageTextSceneDef } from "@/lib/types";
import { useScenario } from "@/lib/scenario-provider";
import Image from "next/image";
import { useCallback, useEffect, useReducer } from "react";

interface ImageTextSceneState {
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
  | { type: "REFRESH_SCENE", scene: ImageTextSceneDef, conversation: Conversation };

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
          console.log("New State:", newState);
          return newState;
        }
      }
    case "REFRESH_SCENE":
      const newState: ImageTextSceneState = {
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
      console.log("New State:", newState);
      return newState;
  }
}

export function ImageTextScene({ scene }: { scene: ImageTextSceneDef }) {
  const [state, dispatch] = useReducer(imageTextSceneReducer, {
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

  console.log("Scene:", scene);

  useEffect(() => {
    const fetchData = async () => {
      if (scene.conversation) {
        const res = await fetch(`/api/conversation?id=${scene.conversation}`);
        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "REFRESH_SCENE", scene, conversation: data });
        } else {
          console.error("Failed to fetch conversation", res.statusText);
        }
      }
    };
    fetchData();
  }, [scene])

  const getCurrentConversation = useCallback(() => {
    return state.conversation.sentences[state.currentSentenceIndex];
  }, [state.currentSentenceIndex, state.conversation]);

  const nextSentence = () => {
    dispatch({ type: "NEXT_SENTENCE" });
    if (state.finished) {
      nextScene();
    }
  }

  return (
    <div className="image-text-scene flex flex-row">
      <div id="left-character" className="w-[30rem] h-[48rem] flex-grow-0">
        {
          state.leftImageUrl === "" ?
            <div></div>
            :
            <div className={state.currentImage === "left" ? "border-2 border-black" : ""}>
              <Image src={state.leftImageUrl} width={400} height={600} alt="Left Character" />
            </div>
        }
      </div>
      <div className={`w-[34rem] bg-url(${scene.background[0]?.url ?? ""})`} onClick={() => { nextSentence() }}>
        <div className="border-2 border-black">
          {
            state.conversation.characters.find(character => {
              return character.id === (state.currentSentence ?? { speaker: "" }).speaker
            })?.name ?? state.currentSentence?.speaker ?? "No Name"
          }
        </div>
        <div className="border-2 border-black">
          {getCurrentConversation()?.text}
        </div>
      </div>
      <div id="right-character" className="w-[20rem] h-[48rem] flex-grow-0">
        {
          state.rightImageUrl === "" ?
            <div></div>
            :
            <div className={state.currentImage === "right" ? "border-2 border-black" : ""}>
              <Image src={state.rightImageUrl} width={400} height={600} alt="Right Character" />
            </div>
        }
      </div>
    </div>
  )
}
