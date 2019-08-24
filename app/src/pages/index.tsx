import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import { poisky } from "../utils/PoiColors"
import { height } from "@material-ui/system"
import { RootStateType } from "../states/RootState"
import { connect } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"

type IndexPagePropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
class IndexPage extends React.Component<IndexPagePropsType> {
  render() {
    return (
      <div
        className="goi-index-page"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "fixed",
        }}
      >
        <Hidden xsDown>
          <NavBar />
        </Hidden>
        <Hidden smUp>
          <div style={{ background: poisky, height: "1px" }} />
        </Hidden>
        <main>
          <WordAdder />
          <Container>
            <GoiTester />
          </Container>
        </main>
        <CommandsBar />
        <div
          className="buildVersion"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            color: "lightgray",
          }}
        >
          catfood build v1.20190825.rc1
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  const props = {
    enableScroll: state.Layout.get("EnableScroll") as boolean,
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
)(IndexPage)
