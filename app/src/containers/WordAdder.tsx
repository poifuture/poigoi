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
  AddPendingQuerysAction,
  RemovePendingQueryAction,
  AddWordsFromQuerysAction,
  ClearPendingWordsAction,
  RefreshSubtotalAction,
  UpdateFilterAction,
} from "../actions/WordAdderActions"
import {
  WordAdderSuggestionQueryType,
  WordAdderQueryCountersType,
  WordAdderPendingQueryType,
  WordAdderQueryType,
  WordFilterType,
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
import { I18nString } from "../types/GoiDictionaryTypes"
import { withTranslation, WithTranslation } from "react-i18next"
import { LookUp } from "../utils/PoiI18n"
import { LocaleCode } from "../types/PoiI18nTypes"

type WordAdderPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation
interface WordAdderStateType {
  customQuery: string
  addingWordsProgress: boolean
}
const QueryRegexPopup = ({ regex }: { regex: string }) => {
  return <span style={{ color: "gray", fontSize: "0.5rem" }}>/{regex}/</span>
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
  addSuggestion = async (
    suggestion: WordAdderSuggestionQueryType
  ): Promise<void> => {
    const { poiUserId, savingId } = this.props
    if (Array.isArray(suggestion.SubQuerys)) {
      await this.props.addPendingQuerys(
        {
          querys: [
            ...suggestion.SubQuerys,
            { Display: suggestion.Display, Query: suggestion.Query },
          ],
        },
        { poiUserId, savingId }
      )
    }
    this.props.refreshSubtotal(
      {
        querys: [
          ...this.getPendingQuerys(),
          ...(suggestion.SubQuerys || []).map(query => query.Query),
        ],
        filter: this.props.filter.toJS(),
      },
      { poiUserId, savingId }
    )
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
    const query = this.state.customQuery.trim()
    this.props.addPendingQuery(
      {
        display: { en: "Custom", zh: "自定义搜索条件" },
        query,
      },
      { poiUserId, savingId }
    )
    this.props.refreshSubtotal(
      {
        querys: [...this.getPendingQuerys(), query],
        filter: this.props.filter.toJS(),
      },
      { poiUserId, savingId }
    )
  }
  onClickRemovePendingQuery = ({ query }: { query: string }) => {
    const { poiUserId, savingId } = this.props
    this.props.removePendingQuery({ query })
    const newPendingQuerys = this.getPendingQuerys().filter(
      pendingQuery => pendingQuery != query
    )
    this.props.refreshSubtotal(
      {
        querys: newPendingQuerys,
        filter: this.props.filter.toJS(),
      },
      { poiUserId, savingId }
    )
  }
  render() {
    const { t, i18n } = this.props
    if (!this.props.display) {
      return <div className="word-adder"></div>
    }
    const { poiUserId, savingId } = this.props
    const { learnedCount, prioritiedCount, pendingCount } = {
      learnedCount: this.props.status.get("LearnedCount") as number,
      prioritiedCount: this.props.status.get("PrioritiedCount") as number,
      pendingCount: this.props.status.get("PendingCount") as number,
    }
    const suggestions: WordAdderSuggestionQueryType[] = this.props.suggestions.toJS()
    const pendings: WordAdderPendingQueryType[] = this.props.pendings.toJS()
    const counters: WordAdderQueryCountersType = this.props.counters.toJS()
    return (
      <ResponsiveDialog className="word-adder" open={this.props.display}>
        <DialogTitle>{t("WordAdderTitle", "Add words")}</DialogTitle>
        <DialogContent dividers>
          <MuiList dense={true}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                label={t("SavingStatusLearnedCountLabel", "Learned")}
                value={learnedCount >= 0 ? learnedCount : "..."}
                margin="none"
                style={{ marginRight: "10px", flex: 1 }}
                InputProps={{ readOnly: true }}
              ></TextField>
              <TextField
                label={t("SavingStatusPrioritiedCountLabel", "Prioritied")}
                value={prioritiedCount >= 0 ? prioritiedCount : "..."}
                margin="none"
                style={{ marginRight: "10px", flex: 1 }}
                InputProps={{ readOnly: true }}
              ></TextField>
              <TextField
                label={t("SavingStatusPendingCountLabel", "Pending")}
                value={pendingCount >= 0 ? pendingCount : "..."}
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
                {t("SuggestionSectionTitle", "Suggested Word Querys")}
              </Typography>
            </li>
            {suggestions.map(suggestion => {
              const {
                TotalCount,
                LearnedCount,
                AddedCount,
                NewCount,
              } = counters[suggestion.Query]
                ? counters[suggestion.Query]
                : {
                    TotalCount: -1,
                    LearnedCount: -1,
                    AddedCount: -1,
                    NewCount: -1,
                  }
              return (
                <MuiListItem key={`suggestion${suggestion.Query}`}>
                  <MuiListItemText
                    primary={
                      <>
                        {LookUp(
                          suggestion.Display,
                          i18n.language as LocaleCode
                        )}
                        <QueryRegexPopup regex={suggestion.Query} />
                        {counters[suggestion.Query] &&
                          t("CountQueryTotalResult", {
                            defaultValue: " {{total}} words",
                            total: TotalCount >= 0 ? TotalCount : "...",
                          })}
                      </>
                    }
                    secondary={
                      counters[suggestion.Query] ? (
                        <>
                          {t("CountSuggestionQueryResult", {
                            defaultValue:
                              "Learned {{learned}} | Added {{added}} | New {{new}}",
                            learned: LearnedCount >= 0 ? LearnedCount : "...",
                            added: AddedCount >= 0 ? AddedCount : "...",
                            new: NewCount >= 0 ? NewCount : "...",
                          })}
                        </>
                      ) : null
                    }
                  ></MuiListItemText>
                  <MuiListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Add suggestion query"
                      onClick={() => this.addSuggestion(suggestion)}
                    >
                      <AddIcon />
                    </IconButton>
                  </MuiListItemSecondaryAction>
                </MuiListItem>
              )
            })}
            <div style={{ display: "flex" }}>
              <TextField
                label={t("CustomQueryInputLabel", "Custom Query")}
                variant="outlined"
                value={this.state.customQuery}
                style={{ flexGrow: 1 }}
                onChange={e => {
                  this.setState({ customQuery: e.target.value })
                }}
                InputProps={{
                  placeholder: t(
                    "CustomQueryInputPlaceholder",
                    "(e.g. JLPT-N5) Accept RegExp"
                  ),
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
                {t("WordsToAddSectionTitle", "Words to add (Order matters)")}
              </Typography>
            </li>
            {pendings.length ? (
              <>
                <MuiListItem key="ClearAllPendingQuerys">
                  <MuiListItemText
                    primary={t("CountTotalPendingWords", {
                      defaultValue: "Total new: {{new}}",
                      new:
                        this.props.subtotal >= 0 ? this.props.subtotal : "...",
                    })}
                    secondary={t(
                      "ClearAllPendingsItemText",
                      "Click right button to clear list"
                    )}
                  ></MuiListItemText>
                  <MuiListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="clear all pending query"
                      onClick={() => this.clearAllPendingQuerys()}
                    >
                      <ExploreOffIcon />
                    </IconButton>
                  </MuiListItemSecondaryAction>
                </MuiListItem>
                {pendings.map(pending => {
                  const {
                    TotalCount,
                    LearnedCount,
                    AddedCount,
                    NewCount,
                  } = counters[pending.Query]
                    ? counters[pending.Query]
                    : {
                        TotalCount: -1,
                        LearnedCount: -1,
                        AddedCount: -1,
                        NewCount: -1,
                      }
                  return (
                    <MuiListItem key={`pending${pending.Query}`}>
                      <MuiListItemText
                        primary={
                          <>
                            {LookUp(
                              pending.Display,
                              i18n.language as LocaleCode
                            )}
                            <QueryRegexPopup regex={pending.Query} />
                            {counters[pending.Query] &&
                              t("CountQueryTotalResult", {
                                defaultValue: " {{total}} words",
                                total: TotalCount >= 0 ? TotalCount : "...",
                              })}
                          </>
                        }
                        secondary={
                          counters[pending.Query] ? (
                            <>
                              {t("CountPendingQueryResult", {
                                defaultValue:
                                  "Learned {{learned}} | Added {{added}} | New {{new}}",
                                learned:
                                  LearnedCount >= 0 ? LearnedCount : "...",
                                added: AddedCount >= 0 ? AddedCount : "...",
                                new: NewCount >= 0 ? NewCount : "...",
                              })}
                            </>
                          ) : null
                        }
                      ></MuiListItemText>

                      <MuiListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="remove pending query"
                          onClick={() =>
                            this.onClickRemovePendingQuery({
                              query: pending.Query,
                            })
                          }
                        >
                          <CloseIcon />
                        </IconButton>
                      </MuiListItemSecondaryAction>
                    </MuiListItem>
                  )
                })}
              </>
            ) : (
              <MuiListItem>
                <MuiListItemText>
                  {t("NoWordsItemPlaceholder", "No words to add")}
                </MuiListItemText>
              </MuiListItem>
            )}
            <Divider component="li" />
            <li>
              <Typography display="block" variant="caption">
                [WIP]
                {t("FiltersSectionTitle", "Filters")}
              </Typography>
            </li>
            <div style={{ display: "flux" }}>
              <FormControlLabel
                control={
                  <Checkbox checked={true} disabled value="BasicFilter" />
                }
                label={t("BasicFilterLabel", "Basic")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    disabled
                    onChange={() => {}}
                    value="ProperFilter"
                  />
                }
                label={t("ProperFilterLabel", "Proper")}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={true} disabled value="IdiomFilter" />
                }
                label={t("IdiomFilterLabel", "Idiom")}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={true} disabled value="ExtraFilter" />
                }
                label={t("ExtraFilterLabel", "Extra")}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={true} disabled value="ForgotFilter" />
                }
                label={t("ForgotFilterLabel", "Forgot")}
              />
            </div>
          </MuiList>
        </DialogContent>
        <DialogActions>
          {this.state.addingWordsProgress ? (
            <Button disabled>
              {t("AddingWordsProgressText", "Adding words...")}
            </Button>
          ) : (
            <>
              <Button onClick={() => this.props.close()}>
                {t("WordAdderCancelButtonText", "Cancel")}
              </Button>
              {pendings.length <= 0 ? (
                <Button disabled>
                  {t("NoPendingWordsPromptText", "No words")}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.onClickConfirm}
                >
                  {t("WordAdderConfirmButtonText", "Add these words")}
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
    filter: state.WordAdder.get("Filter"),
    subtotal: state.WordAdder.get("Subtotal") as number,
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
      { display, query }: { display: I18nString; query: string },
      {
        poiUserId,
        savingId,
      }: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId }
    ) =>
      dispatch(
        AddPendingQueryAction({ display, query }, { poiUserId, savingId })
      ),
    addPendingQuerys: (
      {
        querys,
      }: {
        querys: WordAdderQueryType[]
      },
      {
        poiUserId,
        savingId,
      }: {
        poiUserId: PoiUser.PoiUserId
        savingId: GoiSavingId
      }
    ) => dispatch(AddPendingQuerysAction({ querys }, { poiUserId, savingId })),
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
    refreshSubtotal: (
      {
        querys,
        filter,
      }: {
        querys: string[]
        filter: WordFilterType
      },
      {
        poiUserId,
        savingId,
      }: {
        poiUserId: PoiUser.PoiUserId
        savingId: GoiSavingId
      }
    ) =>
      dispatch(
        RefreshSubtotalAction({ querys, filter }, { poiUserId, savingId })
      ),
    updateFilter: ({ filter }: { filter: Partial<WordFilterType> }) =>
      dispatch(UpdateFilterAction({ filter })),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("WordAdder")(WordAdder))
