import { fromJS, Map } from "immutable"
import KanaDictionary from "../dictionary/KanaDictionary"
import {
  GoiJaTesterActionTypes,
  CHANGE_GOI_TESTER_WORD,
} from "../actions/GoiJaTesterActions"
import { GoiTesterStateType } from "../states/GoiTesterState"

const InitialGoiTesterState: GoiTesterStateType = {
  CurrentWord: KanaDictionary.words["あ"],
}

export const GoiTesterReducer = (
  state: Map<string, any> = fromJS(InitialGoiTesterState),
  action: GoiJaTesterActionTypes
) => {
  console.debug("Reducing GoiJaTester...", action.type)
  switch (action.type) {
    case CHANGE_GOI_TESTER_WORD: {
      return state.set("CurrentWord", fromJS(action.word))
    }
  }
  return state
}

export default GoiTesterReducer
