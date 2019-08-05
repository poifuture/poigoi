import { fromJS, Map } from "immutable"
import KanaDictionary from "../dictionary/KanaDictionary"
import {
  GoiTesterActionTypes,
  UpdateGoiTesterWordActionType,
  UpdateCandidatesActionType,
  UPDATE_GOI_TESTER_WORD,
  UPDATE_CANDIDATES,
  UPDATE_JUDGE_RESULT,
  UpdateJudgeResultActionType,
} from "../actions/GoiTesterActions"
import { GoiTesterStateType } from "../states/GoiTesterState"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import Heap from "../algorithm/Heap"

const InitialGoiTesterState: GoiTesterStateType = {
  CurrentWord: KanaDictionary.words["あ"],
  JudgeResult: "Pending",
  Record: null,
  LearnedCandidates: new Heap<GoiWordRecordDataType>([]),
  PrioritiedCandidates: new Heap<GoiWordRecordDataType>([]),
  PendingCandidates: new Heap<GoiWordRecordDataType>([]),
}

export const GoiTesterReducer = (
  state: Map<string, any> = fromJS(InitialGoiTesterState),
  action: GoiTesterActionTypes
) => {
  console.debug("Reducing GoiJaTester...", action.type)
  switch (action.type) {
    case UPDATE_GOI_TESTER_WORD: {
      console.debug("Hit UPDATE_GOI_USER_STATE ... ", action)
      const typedAction = action as UpdateGoiTesterWordActionType
      return state.merge({
        ...(typedAction.Word && {
          CurrentWord: fromJS(typedAction.Word),
        }),
        ...(typedAction.Record && {
          Record: fromJS(typedAction.Record),
        }),
      })
    }
    case UPDATE_JUDGE_RESULT: {
      console.debug("Hit UPDATE_JUDGE_RESULT ... ", action)
      const typedAction = action as UpdateJudgeResultActionType
      return state.set("JudgeResult", typedAction.JudgeResult)
    }
    case UPDATE_CANDIDATES: {
      console.debug("Hit UPDATE_CANDIDATES ... ", action)
      const typedAction = action as UpdateCandidatesActionType
      const newState = state.merge({
        ...(typedAction.LearnedCandidates && {
          LearnedCandidates: typedAction.LearnedCandidates,
        }),
        ...(typedAction.PrioritiedCandidates && {
          PrioritiedCandidates: typedAction.PrioritiedCandidates,
        }),
        ...(typedAction.PendingCandidates && {
          PendingCandidates: typedAction.PendingCandidates,
        }),
      })
      console.debug("Reduced candidates state: ", newState)
      return newState
    }
  }
  return state
}

export default GoiTesterReducer
