import {
  GoiSettingsStateType,
  NewWordsOrderType,
  RevisitStrategyType,
} from "../states/GoiSettingsState"
import { GoiUser, GoiUserModel } from "../models/GoiUser"
import { GoiSettings, GoiSettingsModel } from "../models/GoiSettings"
import * as PoiUser from "../utils/PoiUser"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { RootStateType } from "../states/RootState"

export const UPDATE_GOI_SETTINGS_STATE =
  "GOI_SETTINGS_ACTIONS_UPDATE_GOI_SETTINGS_STATE"

export interface UpdateGoiSettingsStateActionType
  extends Action<typeof UPDATE_GOI_SETTINGS_STATE> {
  NewWordsOrder?: NewWordsOrderType
  RevisitStrategy?: RevisitStrategyType
}

export type GoiSettingsActionsType = UpdateGoiSettingsStateActionType

export const UpdateGoiSettingsStateAction = ({
  newWordsOrder,
  revisitStrategy,
}: {
  newWordsOrder?: NewWordsOrderType
  revisitStrategy?: RevisitStrategyType
}): UpdateGoiSettingsStateActionType => {
  return {
    type: UPDATE_GOI_SETTINGS_STATE,
    NewWordsOrder: newWordsOrder,
    RevisitStrategy: revisitStrategy,
  }
}
