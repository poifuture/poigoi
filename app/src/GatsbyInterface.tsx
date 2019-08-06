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

const PreventDefault = (e: Event) => e.preventDefault()
export const OnRouteUpdate = ({ location }: { location: Location }) => {
  console.log("new pathname", location.pathname)
  if (location.pathname === "/") {
    // document.body.addEventListener("touchmove", PreventDefault, {
    //   passive: false,
    // })
  } else {
    // document.body.removeEventListener("touchmove", PreventDefault)
  }
}
