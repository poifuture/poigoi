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
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
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
import ExploreOffIcon from "@material-ui/icons/ExploreOffOutlined"
import { useTheme } from "@material-ui/styles"
import ResponsiveDialog from "../components/ResponsiveDialog"

type WordAdderPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface WordAdderStateType {
  customQuery: string
  addingWordsProgress: boolean
}
export class WordAdder extends React.Component<
  WordAdderPropsType,
  WordAdderStateType
> {
  constructor(props: WordAdderPropsType) {
    super(props)
    this.state = { customQuery: "", addingWordsProgress: false }
  }
  getSuggestionQuerys = (): string[] => {
    const suggestions: WordAdderSuggestionQueryType[] = this.props.suggestions.toJS()
    return suggestions.map(suggestion => suggestion.Query)
  }
  getPendingQuerys = (): string[] => {
    const pendings: WordAdderPendingQueryType[] = this.props.pendings.toJS()
    return pendings.map(pending => pending.Query)
  }
  clearAllPendingQuerys = async () => {
    await Promise.all(
      this.getPendingQuerys().map(query =>
        this.props.removePendingQuery({ query })
      )
    )
  }
  onClickConfirm = async () => {
    const { poiUserId, savingId } = this.props
    this.setState({ addingWordsProgress: true })
    await this.props.addWordsFromQuerys(
      { querys: this.getPendingQuerys() },
      { poiUserId, savingId }
    )
    this.setState({ addingWordsProgress: false })
    this.props.close()
    await this.clearAllPendingQuerys()
    await this.props.showNextWord(poiUserId, savingId)
  }
  addCustomQuery = () => {
    const { poiUserId, savingId } = this.props
    this.props.addPendingQuery(
      {
        display: "Custom",
        query: this.state.customQuery.trim(),
      },
      { poiUserId, savingId }
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
      <ResponsiveDialog className="word-adder" open={this.props.display}>
        <DialogTitle>Add words</DialogTitle>
        <DialogContent dividers>
          <MuiList dense={true}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
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
            </div>
            <MuiListItem></MuiListItem>
            <Divider component="li" />
            <li>
              <Typography display="block" variant="caption">
                Suggested Word Querys
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
                        onClick={() => this.addCustomQuery()}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  onKeyDown: e => {
                    if (e.key === "Enter") {
                      this.addCustomQuery()
                    }
                  },
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
              <>
                <MuiListItem key="ClearAllPendingQuerys">
                  <MuiListItemText
                    primary="Clear all"
                    secondary="Total new: [WIP]"
                  ></MuiListItemText>
                  <MuiListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remove pending query"
                      onClick={() => this.clearAllPendingQuerys()}
                    >
                      <ExploreOffIcon />
                    </IconButton>
                  </MuiListItemSecondaryAction>
                </MuiListItem>
                {pendings.map(pending => (
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
                ))}
              </>
            ) : (
              <MuiListItem>
                <MuiListItemText>No words to add</MuiListItemText>
              </MuiListItem>
            )}
            <Divider component="li" />
            <li>
              <Typography display="block" variant="caption">
                [WIP] Filters
              </Typography>
            </li>
            <div style={{ display: "flux" }}>
              <FormControlLabel
                control={<Checkbox checked={true} disabled value="Basic" />}
                label="Basic"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    disabled
                    onChange={() => {}}
                    value="Proper"
                  />
                }
                label="Proper"
              />
              <FormControlLabel
                control={<Checkbox checked={true} disabled value="Idiom" />}
                label="Idiom"
              />
              <FormControlLabel
                control={<Checkbox checked={true} disabled value="Extra" />}
                label="Extra"
              />
            </div>
          </MuiList>
        </DialogContent>
        <DialogActions>
          {this.state.addingWordsProgress ? (
            <>
              <Button disabled>Adding words...</Button>
            </>
          ) : (
            <>
              <Button onClick={() => this.props.close()}>Cancel</Button>
              {pendings.length <= 0 ? (
                <Button disabled>No words</Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.onClickConfirm}
                >
                  Add these words
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </ResponsiveDialog>
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
