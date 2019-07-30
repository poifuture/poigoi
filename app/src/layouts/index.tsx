import React from "react"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import RootReducer from "../reducers/RootReducer"

export class Layout extends React.Component {
  render() {
    return (
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <Provider store={createStore(RootReducer, applyMiddleware(thunk))}>
          {this.props.children}
        </Provider>
      </div>
    )
  }
}

export default Layout
