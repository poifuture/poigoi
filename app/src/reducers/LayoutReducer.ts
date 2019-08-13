import { fromJS, Map } from "immutable"
import { LayoutStateType } from "../states/LayoutState"
import { Action } from "redux"

const InitialLayoutState: LayoutStateType = {
  DisplayNavBar: false,
}

export const LayoutReducer = (
  state: Map<string, any> = fromJS(InitialLayoutState),
  action: Action
) => {
  switch (action.type) {
    default: {
      break
    }
  }
  return state
}

export default LayoutReducer
