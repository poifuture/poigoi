import React from "react"
import { connect } from "react-redux"
import * as MUI from "@material-ui/core"
import * as Icons from "@material-ui/icons"
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
import { GoiSavingId } from "../types/GoiTypes"
import { RootStateType } from "../states/RootState"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"
import { ShowNextWordAction } from "../actions/GoiTesterActions"

type WordAdderPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface WordAdderStateType {
  customQuery: string
}
export class WordAdder extends React.Component<
  WordAdderPropsType,
  WordAdderStateType
> {
  constructor(props: WordAdderPropsType) {
    super(props)
    this.state = { customQuery: "" }
  }
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
    this.props.close()
    this.getPendingQuerys().map(query =>
      this.props.removePendingQuery({ query })
    )
    await this.props.showNextWord(poiUserId, savingId)
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
      <MUI.Dialog className="word-adder" open={this.props.display}>
        <MUI.Container>
          <h1>Word Adder</h1>
          <p>Status:</p>
          <div>Learned:{status.LearnedCount}</div>
          <div>Prioritied:{status.PrioritiedCount}</div>
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
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <MUI.TextField
              label="Custom Query"
              variant="outlined"
              value={this.state.customQuery}
              style={{ flexGrow: 1 }}
              onChange={e => {
                this.setState({ customQuery: e.target.value })
              }}
              inputProps={{
                // placeholder: "(e.g. JLPT-N5) Accept RegExp",
                endAdornment: (
                  <MUI.InputAdornment position="end">Kg</MUI.InputAdornment>
                ),
                // <MUI.InputAdornment position="end">
                //   <MUI.IconButton
                //     aria-label="add query"
                //     edge="end"
                //     onClick={() =>
                //       this.props.addPendingQuery(
                //         { display: "Custom", query: this.state.customQuery },
                //         { poiUserId, savingId }
                //       )
                //     }
                //   >
                //     <Icons.SearchOutlined />
                //   </MUI.IconButton>
                // </MUI.InputAdornment>
              }}
            ></MUI.TextField>
          </div>
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
        </MUI.Container>
      </MUI.Dialog>
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
    showNextWord: (poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) =>
      dispatch(ShowNextWordAction({ poiUserId, savingId })),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordAdder)
