import React from "react"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import RootReducer from "../reducers/RootReducer"
import "./layout.css"

export class Layout extends React.Component {
  render() {
    return (
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <Provider
          store={createStore(
            RootReducer,
            composeWithDevTools({})(applyMiddleware(thunk))
          )}
        >
          {this.props.children}
        </Provider>
      </div>
    )
  }
}

export default Layout
