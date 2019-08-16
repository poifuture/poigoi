import { fromJS, Map } from "immutable"
import { GoiSettingsStateType } from "../states/GoiSettingsState"
import {
  GoiSettingsActionsType,
  UpdateGoiSettingsStateActionType,
  UPDATE_GOI_SETTINGS_STATE,
} from "../actions/GoiSettingsActions"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:GoiSettingsReducer")

const InitialGoiSettingsState: GoiSettingsStateType = {
  NewWordsOrder: "Ordered",
  RevisitStrategy: "RevisitFirst",
}

export const GoiSettingsReducer = (
  state: Map<string, any> = fromJS(InitialGoiSettingsState),
  action: GoiSettingsActionsType
) => {
  switch (action.type) {
    case UPDATE_GOI_SETTINGS_STATE: {
      debug("Hit UPDATE_GOI_SETTINGS_STATE ... ")
      const typedAction = action as UpdateGoiSettingsStateActionType
      return state.merge({
        ...(typedAction.NewWordsOrder && {
          NewWordsOrder: typedAction.NewWordsOrder,
        }),
        ...(typedAction.RevisitStrategy && {
          RevisitStrategy: typedAction.RevisitStrategy,
        }),
      })
    }
  }
  return state
}

export default GoiSettingsReducer
