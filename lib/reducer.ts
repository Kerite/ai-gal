import { Scenario } from "./types";

export interface ScenarioState {
  scenario?: Scenario;
  currentSceneIndex: number;
}

type ScenarioAction = { type: "NEW_SCENARIO", scenario: Scenario }
  | { type: "RECOVER_SCENARIO", scenario: Scenario, currentSceneIndex: number }
  | { type: "JUMP_TO_SCENE", sceneIndex: number }
  | { type: "NEXT_SCENE" }
  | { type: "LOAD_ERROR", message: string }

export const scenarioReducer = (state: ScenarioState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case "RECOVER_SCENARIO":
      return {
        ...state,
        scenario: action.scenario,
        currentSceneIndex: action.currentSceneIndex,
      }
    case "NEXT_SCENE":
      return {
        ...state,
        currentSceneIndex: state.currentSceneIndex + 1,
      }
    case "NEW_SCENARIO":
      return {
        ...state,
        scenario: action.scenario,
        currentSceneIndex: 0,
      }
    case "JUMP_TO_SCENE":
      return {
        ...state,
        currentSceneIndex: action.sceneIndex
      }
    case "LOAD_ERROR":
      return {
        ...state,
        scenario: undefined,
        currentSceneIndex: -1,
      }
  }
}