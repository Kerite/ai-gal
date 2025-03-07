"use client";
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useReducer } from "react";
import { Scenario } from "./types";
import { scenarioReducer, ScenarioState } from "./reducer";
import { ObjectivesData, ApiResponse } from "./api-types";

const emptyScenario: Scenario = {
  id: "",
  scenes: []
}

const initialState: ScenarioState = {
  scenario: emptyScenario,
  currentSceneIndex: 0,
  objectives: []
}

export interface ScenarioContextInterface extends ScenarioState {
  loadScenario: (scenarioId: string) => Promise<void>;
  nextScene: () => void;
  jumpToScene: (targetSceneIndex: number) => void;
  markObjectiveCompleted: (objectiveId: string) => void;
}

const ScenarioContext = createContext<ScenarioContextInterface>({
  ...initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadScenario: (scenarioId: string) => { throw "Shouldn't call this" },
  nextScene: () => { throw "Shouldn't call this" },
  jumpToScene: () => { throw "Shouldn't call this" },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markObjectiveCompleted: (objectiveId: string) => { throw "Shouldn't call this" },
});

export function ScenarioProvider({ children }: { children?: ReactNode }) {
  const context = ScenarioContext;

  const [state, dispatch] = useReducer(scenarioReducer, initialState);

  const loadObjective = useCallback(async (sceneId: string) => {
    const res = await fetch("/api/objectives?sceneId=" + sceneId);
    const data: ApiResponse<ObjectivesData> = await res.json();
    if (res.status === 200 && data.success) {
      console.log("[ScenarioProvider] Objectives of scene", sceneId, "loaded", data.data.objectives);
      return data.data.objectives;
    } else {
      console.error("Load Objective Failed: " + res.statusText)
      throw new Error("Load Objective Failed: " + res.statusText);
    }
  }, []);

  const loadScenario = useCallback(async (scenarioId: string): Promise<void> => {
    const res = await fetch(`/api/scenario?id=${scenarioId}`);
    if (res.status === 200) {
      const data: Scenario = await res.json();
      console.log("[ScenarioProvider] Scenario loaded", data);
      dispatch({
        type: "RECOVER_SCENARIO",
        currentSceneIndex: 0,
        scenario: data
      });
    } else {
      console.error("Load Scenario Failed: " + res.statusText)
      dispatch({ type: "LOAD_ERROR", message: res.statusText })
    }
  }, []);

  const nextScene = useCallback(() => {
    const targetSceneIndex = state.currentSceneIndex + 1;
    const nextSceneId = state.scenario?.scenes[targetSceneIndex]?.id;
    if (!nextSceneId) {
      console.error("Next scene failed: next scene id not found");
      return;
    }
    loadObjective(nextSceneId).then((objectives) => {
      dispatch({ type: "SWITCH_SCENE", objectives, sceneIndex: targetSceneIndex });
    });
  }, [loadObjective, state.currentSceneIndex, state.scenario?.scenes]);

  const jumpToScene = useCallback((targetSceneIndex: number) => {
    const targetSceneId = state.scenario?.scenes[targetSceneIndex].id;
    if (!targetSceneId) {
      console.error("Jump to scene failed: target scene id not found");
      return;
    }
    loadObjective(targetSceneId).then((objectives) => {
      dispatch({ type: "SWITCH_SCENE", objectives, sceneIndex: targetSceneIndex });
    });
  }, [loadObjective, state.scenario?.scenes]);

  const markObjectiveCompleted = useCallback((objectiveId: string) => {
    dispatch({ type: "COMPLETE_OBJECTIVE", objectiveId });
  }, []);

  const contextValue = useMemo<ScenarioContextInterface>(() => {
    return {
      ...state,
      loadScenario,
      nextScene,
      jumpToScene,
      markObjectiveCompleted
    }
  }, [state, loadScenario, nextScene, jumpToScene, markObjectiveCompleted])

  return (
    <context.Provider value={contextValue}>{children}</context.Provider>
  )
}

export function useScenario() {
  return useContext(ScenarioContext);
};
