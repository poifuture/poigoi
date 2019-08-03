import React from "react"
import { connect } from "react-redux"
import WordCard from "../components/WordCard"
import * as PoiUser from "../utils/PoiUser"
import { LazyInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
import { ReindexCandidatesAction } from "../actions/GoiTesterActions"
import { GoiSavingId } from "../types/GoiTypes"

export class GoiTester extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  async componentDidMount() {
    console.debug("Lasy init user")
    const poiUserId = (await this.props.lazyInitUser()) as PoiUser.PoiUserId
    console.debug("Lasy init saving")
    const savingId = await this.props.lazyInitSaving(poiUserId)
    await this.props.reindex(poiUserId, savingId)
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
          {JSON.stringify(this.props.tester, null, 2)}
          {JSON.stringify(this.props.saving, null, 2)}
        </pre>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.debug("GoiTester state: ", state)
  const props = {
    currentWord: state.GoiTester.get("CurrentWord"),
    saving: state.GoiSaving.get("Saving"),
    tester: state.GoiTester,
  }
  console.debug("GoiTester props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    lazyInitUser: () => dispatch(LazyInitUserAction()),
    lazyInitSaving: (poiUserId: PoiUser.PoiUserId) =>
      dispatch(LazyInitSavingAction(poiUserId)),
    reindex: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ReindexCandidatesAction(poiUserId, savingId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoiTester)
