import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"

export class CommandsBar extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  render() {
    const poiUserId = this.props.poiUserId
    const savingId = this.props.savingId
    return (
      <div className="commands-bar">
        <button onClick={() => this.props.showWordAdder(poiUserId, savingId)}>
          Add Words
        </button>
        <button>[WIP]Menu</button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.debug("CommandsBar state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
  }
  console.debug("CommandsBar props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    showWordAdder: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ShowWordAdderAction(poiUserId, savingId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandsBar)
