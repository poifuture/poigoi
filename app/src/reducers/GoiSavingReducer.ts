import { fromJS, Map } from "immutable"
import { GoiSavingStateType } from "../states/GoiSavingState"
import {
  GoiSavingActionsType,
  UpdateGoiSavingStateActionType,
  UPDATE_GOI_SAVING_STATE,
} from "../actions/GoiSavingActions"
import { GoiSavingDbKey } from "../models/GoiSaving"

const InitialGoiSavingState: GoiSavingStateType = {
  SavingDbKey: "" as GoiSavingDbKey,
  Saving: {},
}

export const GoiSavingReducer = (
  state: Map<string, any> = fromJS(InitialGoiSavingState),
  action: GoiSavingActionsType
) => {
  console.debug("Initial GoiTester state: ", state)
  switch (action.type) {
    case UPDATE_GOI_SAVING_STATE: {
      const typedAction = action as UpdateGoiSavingStateActionType
      return state.merge({
        SavingDbKey: typedAction.SavingDbKey,
        ...(typedAction.Saving && { Saving: typedAction.Saving }),
      })
    }
  }
  return state
}

export default GoiSavingReducer
