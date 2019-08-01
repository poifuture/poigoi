import React from "react"
import { connect } from "react-redux"
import {
  DisplayWordAdderAction,
  AddPendingQueryAction,
  RemovePendingQueryAction,
} from "../actions/WordAdderActions"
import {
  WordAdderSuggestionQueryType,
  WordAdderQueryCountersType,
  WordAdderPendingQueryType,
} from "../states/WordAdderState"

export class WordAdderContainer extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  CustomQueryInput: HTMLInputElement | null = null
  render() {
    if (!this.props.display) {
      return <div className="word-adder"></div>
    }
    const status = this.props.status.toJS()
    const suggestions: WordAdderSuggestionQueryType[] = this.props.suggestions.toJS()
    const pendings: WordAdderPendingQueryType[] = this.props.pendings.toJS()
    const counters: WordAdderQueryCountersType = this.props.counters.toJS()
    return (
      <div className="word-adder">
        <h1>Word Adder</h1>
        <p>Status:</p>
        <div>Learned:{status.LearnedCount}</div>
        <div>Prioritized:{status.PrioritizedCount}</div>
        <div>
          Pending:{status.PendingCount}
          <button>[WIP]Clear</button>
        </div>
        <p>Suggestions:</p>
        {suggestions.map(suggestion => (
          <div key={suggestion.Display}>
            {suggestion.Display}({suggestion.Query})
            {counters[suggestion.Query] && (
              <span>
                Total:
                {counters[suggestion.Query].TotalCount}
                (Learned:
                {counters[suggestion.Query].LearnedCount}, Added:
                {counters[suggestion.Query].AddedCount}, New:
                {counters[suggestion.Query].NewCount})
              </span>
            )}
            <button
              onClick={() =>
                this.props.addPendingQuery(suggestion.Display, suggestion.Query)
              }
            >
              +
            </button>
          </div>
        ))}
        <p>
          Custom Query:<input ref={c => (this.CustomQueryInput = c)}></input>
          <button
            onClick={() =>
              this.CustomQueryInput &&
              this.props.addPendingQuery("Custom", this.CustomQueryInput.value)
            }
          >
            +
          </button>
        </p>
        <p>Pendings (order matters):</p>
        {pendings.map(pending => (
          <div key={pending.Query}>
            {pending.Display}({pending.Query})
            {counters[pending.Query] && (
              <span>
                Total:
                {counters[pending.Query].TotalCount}
                (Learned:
                {counters[pending.Query].LearnedCount}, Added:
                {counters[pending.Query].AddedCount}, New:
                {counters[pending.Query].NewCount})
              </span>
            )}
            <button
              onClick={() => this.props.removePendingQuery(pending.Query)}
            >
              -
            </button>
          </div>
        ))}
        <button>Confirm</button>
        <button onClick={() => this.props.cancel()}>Cancel</button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.debug("WordAdderContainer state: ", state)
  const props = {
    display: state.WordAdder.get("Display") as boolean,
    status: state.WordAdder.get("Status"),
    suggestions: state.WordAdder.get("Suggestions"),
    pendings: state.WordAdder.get("Pendings"),
    counters: state.WordAdder.get("Counters"),
    saving: state.GoiSaving.get("Saving"),
  }
  console.debug("WordAdderContainer props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    cancel: () => dispatch(DisplayWordAdderAction(false)),
    addPendingQuery: (hint: string, query: string) =>
      dispatch(AddPendingQueryAction(hint, query)),
    removePendingQuery: (query: string) =>
      dispatch(RemovePendingQueryAction(query)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordAdderContainer)
