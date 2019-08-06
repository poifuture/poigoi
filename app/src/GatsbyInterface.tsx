import React from "react"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import ReduxThunk from "redux-thunk"
import RootReducer from "./reducers/RootReducer"
export const WrapRootElementFunction = ({
  element,
}: {
  element: React.ReactNode
}) => {
  const store = createStore(
    RootReducer,
    composeWithDevTools({})(applyMiddleware(ReduxThunk))
  )
  return <Provider store={store}>{element}</Provider>
}
