import { combineReducers } from "redux"
import GoiTesterReducer from "./GoiTesterReducer"
import GoiUserReducer from "./GoiUserReducer"
import GoiSavingReducer from "./GoiSavingReducer"

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export const RootReducer = combineReducers({
  GoiTester: GoiTesterReducer,
  GoiUser: GoiUserReducer,
  GoiSaving: GoiSavingReducer,
})
export default RootReducer
