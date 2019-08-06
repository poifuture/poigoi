import { combineReducers } from "redux"
import { RootStateType } from "../states/RootState"
import GoiTesterReducer from "./GoiTesterReducer"
import GoiUserReducer from "./GoiUserReducer"
import GoiSavingReducer from "./GoiSavingReducer"
import WordAdderReducer from "./WordAdderReducer"
import LayoutReducer from "./LayoutReducer"

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export const RootReducer = combineReducers<RootStateType>({
  GoiTester: GoiTesterReducer,
  GoiUser: GoiUserReducer,
  GoiSaving: GoiSavingReducer,
  WordAdder: WordAdderReducer,
  Layout: LayoutReducer,
})
export default RootReducer
