import React from "react"
import { connect } from "react-redux"
import {
  TextField,
  Container,
  Dialog,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  ListItemSecondaryAction as MuiListItemSecondaryAction,
  Button,
} from "@material-ui/core"
import SearchIcon from "@material-ui/icons/SearchOutlined"
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
import DeleteIcon from "@material-ui/icons/DeleteOutlined"
import AddIcon from "@material-ui/icons/AddOutlined"
import CloseIcon from "@material-ui/icons/CloseOutlined"

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
      <Dialog className="word-adder" open={this.props.display}>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Container>
            <Typography gutterBottom variant="h4">
              Add words
            </Typography>
            <MuiList dense={true}>
              <Divider component="li" />
              <li>
                <Typography display="block" variant="caption">
                  Current Study Status
                </Typography>
              </li>
              <MuiListItem>
                <TextField
                  label="Learned"
                  value={status.LearnedCount}
                  margin="none"
                  style={{ marginRight: "10px", flex: 1 }}
                  InputProps={{ readOnly: true }}
                ></TextField>
                <TextField
                  label="Prioritied"
                  value={status.PrioritiedCount}
                  margin="none"
                  style={{ marginRight: "10px", flex: 1 }}
                  InputProps={{ readOnly: true }}
                ></TextField>
                <TextField
                  label="Pending"
                  value={status.PendingCount}
                  margin="none"
                  style={{ marginRight: "10px", flex: 1 }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Clear pending words"
                          onClick={() =>
                            this.props.clearPendingWords({
                              poiUserId,
                              savingId,
                            })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              </MuiListItem>
              <Divider component="li" />
              <li>
                <Typography display="block" variant="caption">
                  Suggested Word Lists
                </Typography>
              </li>
              {suggestions.map(suggestion => (
                <MuiListItem key={`suggestion${suggestion.Query}`}>
                  <MuiListItemText
                    primary={`${suggestion.Display} (${suggestion.Query}) ${counters[suggestion.Query].TotalCount} words`}
                    secondary={
                      counters[suggestion.Query] ? (
                        <>
                          <span>{`Learned ${counters[suggestion.Query].LearnedCount}, `}</span>
                          <span>{`Added ${counters[suggestion.Query].AddedCount}, `}</span>
                          <span>{`New ${counters[suggestion.Query].NewCount}`}</span>
                        </>
                      ) : null
                    }
                  ></MuiListItemText>
                  <MuiListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Add suggestion query"
                      onClick={() =>
                        this.props.addPendingQuery(
                          {
                            display: suggestion.Display,
                            query: suggestion.Query,
                          },
                          { poiUserId, savingId }
                        )
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </MuiListItemSecondaryAction>
                </MuiListItem>
              ))}
              <div style={{ display: "flex" }}>
                <TextField
                  label="Custom Query"
                  variant="outlined"
                  value={this.state.customQuery}
                  style={{ flexGrow: 1 }}
                  onChange={e => {
                    this.setState({ customQuery: e.target.value })
                  }}
                  InputProps={{
                    placeholder: "(e.g. JLPT-N5) Accept RegExp",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="add query"
                          edge="end"
                          onClick={() =>
                            this.props.addPendingQuery(
                              {
                                display: "Custom",
                                query: this.state.customQuery.trim(),
                              },
                              { poiUserId, savingId }
                            )
                          }
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              </div>
              <MuiListItem></MuiListItem>
              <Divider component="li" />
              <li>
                <Typography display="block" variant="caption">
                  Words to add (Order matters)
                </Typography>
              </li>
              {pendings.length ? (
                pendings.map(pending => (
                  <MuiListItem key={`pending${pending.Query}`}>
                    <MuiListItemText
                      primary={
                        <>
                          {`${pending.Display} (${pending.Query})`}
                          {counters[pending.Query] &&
                            ` ${counters[pending.Query].TotalCount} words`}
                        </>
                      }
                      secondary={
                        counters[pending.Query] ? (
                          <>
                            {`Learned ${counters[pending.Query].LearnedCount}, `}
                            {`Added ${counters[pending.Query].AddedCount}, `}
                            {`New ${counters[pending.Query].NewCount}`}
                          </>
                        ) : null
                      }
                    ></MuiListItemText>

                    <MuiListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove pending query"
                        onClick={() =>
                          this.props.removePendingQuery({
                            query: pending.Query,
                          })
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </MuiListItemSecondaryAction>
                  </MuiListItem>
                ))
              ) : (
                <MuiListItem>
                  <MuiListItemText>No words to add</MuiListItemText>
                </MuiListItem>
              )}
            </MuiList>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => this.props.close()}>Cancel</Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.onClickConfirm}
              >
                Add these words
              </Button>
            </div>
          </Container>
        </div>
      </Dialog>
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
