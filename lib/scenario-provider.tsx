"use client";
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useReducer } from "react";
import { Scenario } from "./types";
import { scenarioReducer } from "./reducer";

export interface ScenarioState {
  scenario?: Scenario;
  currentSceneIndex: number;
}

const emptyScenario: Scenario = {
  id: "",
  scenes: []
}

export interface ScenarioContextInterface extends ScenarioState {
  loadScenario: (scenarioId: string) => Promise<void>;
  nextScene: () => void;
  jumpToScene: (targetSceneIndex: number) => void;
}

const ScenarioContext = createContext<ScenarioContextInterface>({
  scenario: {
    id: "",
    scenes: []
  },
  currentSceneIndex: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadScenario: (scenarioId: string) => { throw "Shouldn't call this" },
  nextScene: () => { throw "Shouldn't call this" },
  jumpToScene: () => { throw "Shouldn't call this" },
});

export function ScenarioProvider({ children }: { children?: ReactNode }) {
  const context = ScenarioContext;

  const [state, dispatch] = useReducer(scenarioReducer, {
    currentSceneIndex: 0,
    scenario: emptyScenario
  })

  const loadScenario = useCallback(async (scenarioId: string): Promise<void> => {
    const res = await fetch(`/api/scenario?id=${scenarioId}`);
    if (res.status === 200) {
      const data: Scenario = await res.json();
      console.log("Scenario:", data);
      dispatch({
        type: "RECOVER_SCENARIO",
        currentSceneIndex: 0,
        scenario: data
      });
    } else {
      console.log("Load Scenario Failed: " + res.statusText)
      dispatch({ type: "LOAD_ERROR", message: res.statusText })
    }
  }, []);

  const nextScene = useCallback(() => {
    dispatch({ type: "NEXT_SCENE" });
  }, []);

  const jumpToScene = useCallback((targetSceneIndex: number) => {
    dispatch({ type: "JUMP_TO_SCENE", sceneIndex: targetSceneIndex })
  }, [])

  const contextValue = useMemo<ScenarioContextInterface>(() => {
    return {
      ...state,
      loadScenario,
      nextScene,
      jumpToScene
    }
  }, [state, loadScenario, nextScene, jumpToScene])

  return (
    <context.Provider value={contextValue}>{children}</context.Provider>
  )
}

export function useScenario() {
  return useContext(ScenarioContext);
};
