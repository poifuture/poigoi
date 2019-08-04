import { combineReducers } from "redux"
import GoiTesterReducer from "./GoiTesterReducer"
import GoiUserReducer from "./GoiUserReducer"
import GoiSavingReducer from "./GoiSavingReducer"
import WordAdderReducer from "./WordAdderReducer"
import { RootStateType } from "../states/RootState"

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export const RootReducer = combineReducers<RootStateType>({
  GoiTester: GoiTesterReducer,
  GoiUser: GoiUserReducer,
  GoiSaving: GoiSavingReducer,
  WordAdder: WordAdderReducer,
})
export default RootReducer
