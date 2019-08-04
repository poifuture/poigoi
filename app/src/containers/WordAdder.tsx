import React from "react"
import { connect } from "react-redux"
import * as PoiUser from "../utils/PoiUser"
import {
  DisplayWordAdderAction,
  AddPendingQueryAction,
  RemovePendingQueryAction,
  AddWordsFromQuerysAction,
  ClearPendingWordsAction,
} from "../actions/WordAdderActions"
import {
  WordAdderSuggestionQueryType,
  WordAdderQueryCountersType,
  WordAdderPendingQueryType,
} from "../states/WordAdderState"
import { ReindexCandidatesAction } from "../actions/GoiTesterActions"
import { GoiSavingId } from "../types/GoiTypes"
import { RootStateType } from "../states/RootState"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"

export class WordAdder extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  CustomQueryInput: HTMLInputElement | null = null
  getSuggestionQuerys = (): string[] => {
    const suggestions: WordAdderSuggestionQueryType[] = this.props.suggestions.toJS()
    return suggestions.map(suggestion => suggestion.Query)
  }
  getPendingQuerys = (): string[] => {
    const pendings: WordAdderPendingQueryType[] = this.props.pendings.toJS()
    return pendings.map(pending => pending.Query)
  }
  onClickConfirm = async () => {
    const poiUserId = this.props.poiUserId
    const savingId = this.props.savingId
    await this.props.addWordsFromQuerys(
      { querys: this.getPendingQuerys() },
      { poiUserId, savingId }
    )
    await this.props.reindex(poiUserId, savingId)
    this.props.close()
    this.getPendingQuerys().map(query =>
      this.props.removePendingQuery({ query })
    )
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
            onClick={() =>
              this.props.clearPendingWords({ poiUserId, savingId })
            }
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
                  { display: suggestion.Display, query: suggestion.Query },
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
                { display: "Custom", query: this.CustomQueryInput.value },
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
              onClick={() =>
                this.props.removePendingQuery({ query: pending.Query })
              }
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

const mapStateToProps = (state: RootStateType) => {
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
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    clearPendingWords: ({
      poiUserId,
      savingId,
    }: {
      poiUserId: PoiUser.PoiUserId
      savingId: GoiSavingId
    }) => dispatch(ClearPendingWordsAction({ poiUserId, savingId })),
    addPendingQuery: (
      { display, query }: { display: string; query: string },
      {
        poiUserId,
        savingId,
      }: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId }
    ) =>
      dispatch(
        AddPendingQueryAction({ display, query }, { poiUserId, savingId })
      ),
    removePendingQuery: ({ query }: { query: string }) =>
      dispatch(RemovePendingQueryAction({ query })),
    addWordsFromQuerys: (
      { querys }: { querys: string[] },
      {
        poiUserId,
        savingId,
      }: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId }
    ) =>
      dispatch(AddWordsFromQuerysAction({ querys }, { poiUserId, savingId })),
    close: () => dispatch(DisplayWordAdderAction({ display: false })),
    reindex: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ReindexCandidatesAction(poiUserId, savingId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordAdder)
