import { fromJS, Map } from "immutable"
import { TreeMultiSet } from "tstl"
import KanaDictionary from "../dictionary/KanaDictionary"
import {
  GoiTesterActionTypes,
  UpdateGoiTesterWordActionType,
  UpdateCandidatesActionType,
  UPDATE_GOI_TESTER_WORD,
  UPDATE_CANDIDATES,
  UPDATE_JUDGE_RESULT,
  UpdateJudgeResultActionType,
  UPDATE_IS_TYPING,
  UpdateIsTypingActionType,
} from "../actions/GoiTesterActions"
import { GoiTesterStateType } from "../states/GoiTesterState"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:GoiTesterReducer")

const InitialGoiTesterState: GoiTesterStateType = {
  IsTyping: false,
  CurrentWord: KanaDictionary.words["あ"],
  JudgeResult: "Pending",
  Record: null,
  ForcedWordKey: "",
  LearnedCandidates: new TreeMultiSet<GoiWordRecordDataType>(),
  PrioritiedCandidates: new TreeMultiSet<GoiWordRecordDataType>(),
  PendingCandidates: new TreeMultiSet<GoiWordRecordDataType>(),
}

export const GoiTesterReducer = (
  state: Map<string, any> = fromJS(InitialGoiTesterState),
  action: GoiTesterActionTypes
) => {
  switch (action.type) {
    case UPDATE_IS_TYPING: {
      debug("Hit UPDATE_IS_TYPING ... ")
      const typedAction = action as UpdateIsTypingActionType
      return state.set("IsTyping", typedAction.IsTyping)
    }
    case UPDATE_GOI_TESTER_WORD: {
      debug("Hit UPDATE_GOI_TESTER_WORD ... ")
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
      debug("Hit UPDATE_JUDGE_RESULT ... ")
      const typedAction = action as UpdateJudgeResultActionType
      return state.merge({
        JudgeResult: typedAction.JudgeResult,
        ...(typedAction.ForcedWordKey && {
          ForcedWordKey: typedAction.ForcedWordKey,
        }),
      })
    }
    case UPDATE_CANDIDATES: {
      debug("Hit UPDATE_CANDIDATES ... ")
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
      return newState
    }
  }
  return state
}

export default GoiTesterReducer
