import { fromJS, Map } from "immutable"
import { GoiUserStateType } from "../states/GoiUserState"
import {
  GoiUserActionsType,
  UpdateGoiUserStateActionType,
  UPDATE_GOI_USER_STATE,
} from "../actions/GoiUserActions"
import { PoiUserId } from "../utils/PoiUser"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:GoiUserReducer")

const InitialGoiUserState: GoiUserStateType = {
  PoiUserId: "" as PoiUserId,
  Domain: "Local",
}

export const GoiUserReducer = (
  state: Map<string, any> = fromJS(InitialGoiUserState),
  action: GoiUserActionsType
) => {
  switch (action.type) {
    case UPDATE_GOI_USER_STATE: {
      debug("Hit UPDATE_GOI_USER_STATE ... ")
      const typedAction = action as UpdateGoiUserStateActionType
      const newState = state.merge({
        PoiUserId: typedAction.PoiUserId,
        ...(typedAction.Domain && { Domain: typedAction.Domain }),
      })
      return newState
    }
  }
  return state
}

export default GoiUserReducer
