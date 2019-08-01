import { fromJS, Map } from "immutable"
import { GoiUserStateType } from "../states/GoiUserState"
import {
  GoiUserActionsType,
  UpdateGoiUserStateActionType,
  UPDATE_GOI_USER_STATE,
} from "../actions/GoiUserActions"
import { PoiUserId } from "../utils/PoiUser"

const InitialGoiUserState: GoiUserStateType = {
  PoiUserId: "" as PoiUserId,
  Domain: "Local",
}

export const GoiUserReducer = (
  state: Map<string, any> = fromJS(InitialGoiUserState),
  action: GoiUserActionsType
) => {
  console.debug("Reducing GoiUser... ", action.type)
  switch (action.type) {
    case UPDATE_GOI_USER_STATE: {
      console.debug("Hit UPDATE_GOI_USER_STATE ... ", action)
      const typedAction = action as UpdateGoiUserStateActionType
      const newState = state.merge({
        PoiUserId: typedAction.PoiUserId,
        ...(typedAction.Domain && { Domain: typedAction.Domain }),
      })
      console.debug("Reduced GoiUser state: ", newState)
      return newState
    }
  }
  return state
}

export default GoiUserReducer
