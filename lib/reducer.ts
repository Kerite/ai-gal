import { Objective } from "./api-types";
import { Scenario, Scene, SceneObjective } from "./types";

export interface ScenarioState {
  scenario?: Scenario;
  currentSceneIndex: number;
  currentScene?: Scene;
  objectives: SceneObjective[];
}

type ScenarioAction = { type: "NEW_SCENARIO", scenario: Scenario }
  | { type: "RECOVER_SCENARIO", scenario: Scenario, currentSceneIndex: number }
  | { type: "SWITCH_SCENE", objectives: Objective[], sceneIndex: number }
  | { type: "NEXT_SCENE", objectives: Objective[] }
  | { type: "LOAD_ERROR", message: string }
  | { type: "COMPLETE_OBJECTIVE", objectiveId: string }
  | { type: "FINISH_SCENARIO" }

export const scenarioReducer = (state: ScenarioState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case "RECOVER_SCENARIO":
      return {
        ...state,
        scenario: action.scenario,
        currentSceneIndex: action.currentSceneIndex,
        currentScene: action.scenario.scenes[action.currentSceneIndex],
      }
    case "NEXT_SCENE":
      return {
        ...state,
        currentSceneIndex: state.currentSceneIndex + 1,
        currentScene: state.scenario?.scenes[state.currentSceneIndex + 1],
        objectives: action.objectives.map((obj) => ({
          id: obj.id,
          description: obj.description,
          completed: false,
        })),
      }
    case "NEW_SCENARIO":
      return {
        ...state,
        scenario: action.scenario,
        currentSceneIndex: 0,
        currentScene: action.scenario.scenes[0],
        objectives: [],
      }
    case "SWITCH_SCENE":
      return {
        ...state,
        currentSceneIndex: action.sceneIndex,
        currentScene: state.scenario?.scenes[action.sceneIndex],
        objectives: action.objectives.map((obj) => ({
          id: obj.id,
          description: obj.description,
          completed: false,
        })),
      }
    case "LOAD_ERROR":
      return {
        ...state,
        scenario: undefined,
        currentSceneIndex: -1,
        currentScene: undefined
      }
    case "COMPLETE_OBJECTIVE":
      return {
        ...state,
        objectives: state.objectives.map((obj) => {
          if (obj.id === action.objectiveId) {
            return { ...obj, completed: true }
          }
          return obj
        }),
      }
    case "FINISH_SCENARIO":
      return {
        ...state,
        scenario: undefined,
        currentSceneIndex: -1,
      }
  }
}