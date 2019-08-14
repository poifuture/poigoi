import { LocalDbKey } from "../utils/PoiDb"
import * as PoiUser from "../utils/PoiUser"
import { LayoutStateType } from "../states/LayoutState"
import { GoiDb } from "../utils/GoiDb"
import { ThunkDispatch, ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { RootStateType } from "../states/RootState"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:LayoutActions")

export const UPDATE_ENABLE_SCROLL = "LAYOUT_ACTIONS_UPDATE_ENABLE_SCROLL"

export interface UpdateEnableScrollActionType
  extends Action<typeof UPDATE_ENABLE_SCROLL> {
  EnableScroll: boolean
}

export type LayoutActionsTypes = UpdateEnableScrollActionType

export const UpdateEnableScrollAction = ({
  enableScroll,
}: {
  enableScroll: boolean
}): UpdateEnableScrollActionType => {
  return {
    type: UPDATE_ENABLE_SCROLL,
    EnableScroll: enableScroll,
  }
}
