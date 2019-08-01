import { fromJS, Map } from "immutable"
import { GoiSavingStateType } from "../states/GoiSavingState"
import {
  GoiSavingActionsType,
  UpdateGoiSavingStateActionType,
  UPDATE_GOI_SAVING_STATE,
} from "../actions/GoiSavingActions"
import { GoiSavingId } from "../types/GoiTypes"

const InitialGoiSavingState: GoiSavingStateType = {
  SavingId: "" as GoiSavingId,
  Saving: {},
}

export const GoiSavingReducer = (
  state: Map<string, any> = fromJS(InitialGoiSavingState),
  action: GoiSavingActionsType
) => {
  console.debug("Reducing GoiSaving...", action.type)
  switch (action.type) {
    case UPDATE_GOI_SAVING_STATE: {
      const typedAction = action as UpdateGoiSavingStateActionType
      return state.merge({
        SavingId: typedAction.SavingId,
        ...(typedAction.Saving && { Saving: typedAction.Saving }),
      })
    }
  }
  return state
}

export default GoiSavingReducer
