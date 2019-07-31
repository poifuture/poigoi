import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"

export class CommandsBar extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  render() {
    return (
      <div className="commands-bar">
        <button onClick={() => this.props.showWordAdder()}>Add Words</button>
        <button>[WIP]Menu</button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.debug("CommandsBar state: ", state)
  const props = {
    // display: state.WordAdder.get("Display") as boolean,
    // status: state.WordAdder.get("Status"),
    // suggestions: state.WordAdder.get("Suggestions"),
    // pendings: state.WordAdder.get("Pendings"),
  }
  console.debug("CommandsBar props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    showWordAdder: () => dispatch(ShowWordAdderAction()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandsBar)
