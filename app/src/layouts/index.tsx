import React from "react"
import { Helmet } from "react-helmet"
import "./layout.css"

export class Layout extends React.Component {
  private static store: any
  render() {
    return (
      <div className="goi-layout">
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
        {this.props.children}
      </div>
    )
  }
}

export default Layout
