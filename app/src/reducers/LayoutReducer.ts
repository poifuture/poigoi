import { fromJS, Map } from "immutable"
import { LayoutStateType } from "../states/LayoutState"
import { Action } from "redux"
import {
  UPDATE_ENABLE_SCROLL,
  UpdateEnableScrollActionType,
} from "../actions/LayoutActions"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:LayoutReducer")

const InitialLayoutState: LayoutStateType = {
  DisplayNavBar: false,
  EnableScroll: true,
}

export const LayoutReducer = (
  state: Map<string, any> = fromJS(InitialLayoutState),
  action: Action
) => {
  switch (action.type) {
    case UPDATE_ENABLE_SCROLL: {
      debug("Hit UPDATE_ENABLE_SCROLL ... ")
      const typedAction = action as UpdateEnableScrollActionType
      const newState = state.merge({
        EnableScroll: typedAction.EnableScroll,
      })
      return newState
    }
  }
  return state
}

export default LayoutReducer
