import React from "react"
import { connect } from "react-redux"
import WordCard from "../components/WordCard"
import KanaDictionary from "../dictionary/KanaDictionary"
import * as PoiUser from "../utils/PoiUser"
import { GoiDb } from "../utils/GoiDb"
import { GoiUserDbKey } from "../models/GoiUser"
import { GoiJaWordType } from "../dictionary/GoiDictionary"
import { GlobalDbKey } from "../utils/PoiDb"
import { LazyInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
import { GoiSavingDbKey } from "../models/GoiSaving"

export class GoiJaTester extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  async componentDidMount() {
    console.debug("Lasy init user")
    await this.props.lazyInitUser()
    console.debug("Lasy init saving")
    await this.props.lazyInitSaving(this.props.userDbKey)
  }
  render() {
    return (
      <div className="goi-core">
        <input id="test-input"></input>
        <WordCard
          word={this.props.currentWord.toJS()}
          display="detailed"
          status="success"
        />
        <pre className="goi-debug">
          {JSON.stringify(this.props.saving, null, 2)}
        </pre>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.debug("GoiJaTester state: ", state)
  const props = {
    currentWord: state.GoiTester.get("CurrentWord"),
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    userDbKey: state.GoiUser.get("UserDbKey") as GoiUserDbKey,
    savingDbKey: state.GoiSaving.get("SavingDbKey") as GoiSavingDbKey,
    saving: state.GoiSaving.get("Saving"),
  }
  console.debug("GoiJaTester props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    lazyInitUser: () => dispatch(LazyInitUserAction()),
    lazyInitSaving: (userDbKey: GoiUserDbKey) =>
      dispatch(LazyInitSavingAction(userDbKey)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoiJaTester)
