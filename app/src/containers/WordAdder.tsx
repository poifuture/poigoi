import React from "react"
import { connect } from "react-redux"
import * as PoiUser from "../utils/PoiUser"
import {
  DisplayWordAdderAction,
  AddPendingQueryAction,
  RemovePendingQueryAction,
  AddWordsFromWordAdderStateAction,
  ClearPendingWordsAction,
} from "../actions/WordAdderActions"
import {
  WordAdderSuggestionQueryType,
  WordAdderQueryCountersType,
  WordAdderPendingQueryType,
} from "../states/WordAdderState"
import { ReindexCandidatesAction } from "../actions/GoiTesterActions"
import { GoiSavingId } from "../types/GoiTypes"

export class WordAdder extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  CustomQueryInput: HTMLInputElement | null = null
  onClickConfirm = async () => {
    await this.props.addWords(this.props.poiUserId, this.props.savingId)
    await this.props.reindex(this.props.poiUserId, this.props.savingId)
    this.props.close()
  }
  render() {
    if (!this.props.display) {
      return <div className="word-adder"></div>
    }
    const poiUserId = this.props.poiUserId
    const savingId = this.props.savingId
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
          <button
            onClick={() => this.props.clearPendingWords(poiUserId, savingId)}
          >
            Clear
          </button>
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
                this.props.addPendingQuery(
                  suggestion.Display,
                  suggestion.Query,
                  { poiUserId, savingId }
                )
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
              this.props.addPendingQuery(
                "Custom",
                this.CustomQueryInput.value,
                { poiUserId, savingId }
              )
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
        <button onClick={this.onClickConfirm}>Confirm</button>
        <button onClick={() => this.props.close()}>Cancel</button>
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
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
  }
  console.debug("WordAdderContainer props: ", props)
  return props
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    clearPendingWords: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ClearPendingWordsAction(poiUserId, savingId)),
    addPendingQuery: (
      display: string,
      query: string,
      options: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId }
    ) =>
      dispatch(
        AddPendingQueryAction(display, query, {
          poiUserId: options.poiUserId,
          savingId: options.savingId,
        })
      ),
    removePendingQuery: (query: string) =>
      dispatch(RemovePendingQueryAction(query)),
    addWords: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(AddWordsFromWordAdderStateAction(poiUserId, savingId)),
    close: () => dispatch(DisplayWordAdderAction(false)),
    reindex: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ReindexCandidatesAction(poiUserId, savingId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordAdder)
