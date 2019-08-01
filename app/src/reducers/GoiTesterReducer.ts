import { fromJS, Map } from "immutable"
import KanaDictionary from "../dictionary/KanaDictionary"
import {
  GoiTesterActionTypes,
  UpdateGoiTesterWordActionType,
  UpdateCandidatesActionType,
  UPDATE_GOI_TESTER_WORD,
  UPDATE_CANDIDATES,
} from "../actions/GoiTesterActions"
import { GoiTesterStateType } from "../states/GoiTesterState"

const InitialGoiTesterState: GoiTesterStateType = {
  CurrentWord: KanaDictionary.words["あ"],
  LearnedCandidates: [],
  PrioritiedCandidates: [],
  PendingCandidates: [],
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
      return state.set("CurrentWord", fromJS(typedAction.Word))
    }
    case UPDATE_CANDIDATES: {
      console.debug("Hit UPDATE_CANDIDATES ... ", action)
      const typedAction = action as UpdateCandidatesActionType
      const newState = state.merge({
        ...(typedAction.LearnedCandidates && {
          LearnedCandidates: fromJS(typedAction.LearnedCandidates),
        }),
        ...(typedAction.PrioritiedCandidates && {
          PrioritiedCandidates: fromJS(typedAction.PrioritiedCandidates),
        }),
        ...(typedAction.PendingCandidates && {
          PendingCandidates: fromJS(typedAction.PendingCandidates),
        }),
      })
      console.debug("Reduced candidates state: ", newState)
      return newState
    }
  }
  return state
}

export default GoiTesterReducer
