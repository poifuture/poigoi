import React from "react"
import { Helmet } from "react-helmet"
import CssBaseline from "@material-ui/core/CssBaseline"
import { connect } from "react-redux"
import { RootStateType } from "../states/RootState"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"
import NavBar from "../components/NavBar"
// import "./layout.css"

export class Layout extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  componentDidMount = () => {
    document.getElementsByTagName("body").item(0)!.ontouchmove = e =>
      e.preventDefault()
  }
  render() {
    const userAgent = window.navigator.userAgent
    const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i)
    const webkit = !!userAgent.match(/WebKit/i)
    const iOSSafari = iOS && webkit && !userAgent.match(/CriOS/i)
    return (
      <>
        <Helmet title="PoiGoi" defer={false}>
          <title>PoiGoi</title>
          <meta name="author" content="nagi" />
          <meta name="description" content="PoiGoi, an app to recite words." />
          <meta
            name="keywords"
            content="vocabulary, words, recite, education, goi, poigoi, poifuture"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          {iOSSafari ? (
            "" //TODO:iOS
          ) : (
            <link rel="manifest" href="/manifest.webmanifest"></link>
          )}
        </Helmet>
        {this.props.displayNavBar && <NavBar />}

        <CssBaseline />
        {this.props.children}
      </>
    )
  }
}
const mapStateToProps = (state: RootStateType) => {
  const props = {
    displayNavBar: state.Layout.get("DisplayNavBar") as boolean,
  }
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)
