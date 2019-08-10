import React from "react"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import ReduxThunk from "redux-thunk"
import RootReducer from "./reducers/RootReducer"
import { renderToString } from "react-dom/server"
import i18n from "i18next"
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

export const ReplaceRenderer = ({
  element,
  replaceBodyHTMLString,
}: {
  element: React.ReactElement
  replaceBodyHTMLString: Function
}) => {
  i18n.loadNamespaces(["common"], () => {
    replaceBodyHTMLString(renderToString(element))
  })
}
