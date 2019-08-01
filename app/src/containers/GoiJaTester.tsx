import React from "react"
import { connect } from "react-redux"
import WordCard from "../components/WordCard"
import KanaDictionary from "../dictionary/KanaDictionary"
import * as PoiUser from "../utils/PoiUser"
import { GoiDb } from "../utils/GoiDb"
import { GoiUserModel, GoiUserDbKey } from "../models/GoiUser"
import { GoiJaWordType } from "../types/GoiDictionaryTypes"
import { GlobalDbKey } from "../utils/PoiDb"
import { LazyInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
import { GoiSavingDbKey } from "../models/GoiSaving"

export class GoiJaTester extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  async componentDidMount() {
    console.debug("Lasy init user")
    const poiUserId = (await this.props.lazyInitUser()) as PoiUser.PoiUserId
    console.debug("Lasy init saving")
    await this.props.lazyInitSaving(poiUserId)
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
        <button>Roll</button>
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
    lazyInitSaving: (poiUserId: PoiUser.PoiUserId) =>
      dispatch(LazyInitSavingAction(poiUserId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoiJaTester)
