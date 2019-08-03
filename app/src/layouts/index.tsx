import React from "react"
import { Helmet } from "react-helmet"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import ReduxThunk from "redux-thunk"
import RootReducer from "../reducers/RootReducer"
import "./layout.css"

export class Layout extends React.Component {
  private static store: any
  private singletonStore = () => {
    if (!Layout.store) {
      Layout.store = createStore(
        RootReducer,
        composeWithDevTools({})(applyMiddleware(ReduxThunk))
      )
    }
    return Layout.store
  }
  render() {
    return (
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <Helmet>
          <title>PoiGoi</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Helmet>
        <Provider store={this.singletonStore()}>{this.props.children}</Provider>
      </div>
    )
  }
}

export default Layout
