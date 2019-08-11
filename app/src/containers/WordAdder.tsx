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
} from "../actions/WordAdderActions"
import {
  WordAdderSuggestionQueryType,
  WordAdderQueryCountersType,
  WordAdderPendingQueryType,
  WordAdderQueryType,
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
        display: { en: "Custom", zh: "自定义搜索条件" },
        query: this.state.customQuery.trim(),
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
    const status = this.props.status.toJS()
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
                value={status.LearnedCount}
                margin="none"
                style={{ marginRight: "10px", flex: 1 }}
                InputProps={{ readOnly: true }}
              ></TextField>
              <TextField
                label={t("SavingStatusPrioritiedCountLabel", "Prioritied")}
                value={status.PrioritiedCount}
                margin="none"
                style={{ marginRight: "10px", flex: 1 }}
                InputProps={{ readOnly: true }}
              ></TextField>
              <TextField
                label={t("SavingStatusPendingCountLabel", "Pending")}
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
                {t("SuggestionSectionTitle", "Suggested Word Querys")}
              </Typography>
            </li>
            {suggestions.map(suggestion => (
              <MuiListItem key={`suggestion${suggestion.Query}`}>
                <MuiListItemText
                  primary={
                    <>
                      {LookUp(suggestion.Display, i18n.language as LocaleCode)}
                      <QueryRegexPopup regex={suggestion.Query} />
                      {counters[suggestion.Query] &&
                        t("CountQueryTotalResult", {
                          defaultValue: " {{total}} words",
                          total: counters[suggestion.Query].TotalCount,
                        })}
                    </>
                  }
                  secondary={
                    counters[suggestion.Query] ? (
                      <>
                        {t("CountSuggestionQueryResult", {
                          defaultValue:
                            "Learned {{learned}} | Added {{added}} | New {{new}}",
                          learned: counters[suggestion.Query].LearnedCount,
                          added: counters[suggestion.Query].AddedCount,
                          new: counters[suggestion.Query].NewCount,
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
            ))}
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
                      new: "[WIP]",
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
                {pendings.map(pending => (
                  <MuiListItem key={`pending${pending.Query}`}>
                    <MuiListItemText
                      primary={
                        <>
                          {LookUp(pending.Display, i18n.language as LocaleCode)}
                          <QueryRegexPopup regex={pending.Query} />
                          {counters[pending.Query] &&
                            t("CountQueryTotalResult", {
                              defaultValue: " {{total}} words",
                              total: counters[pending.Query].TotalCount,
                            })}
                        </>
                      }
                      secondary={
                        counters[pending.Query] ? (
                          <>
                            {t("CountPendingQueryResult", {
                              defaultValue:
                                "Learned {{learned}} | Added {{added}} | New {{new}}",
                              learned: counters[pending.Query].LearnedCount,
                              added: counters[pending.Query].AddedCount,
                              new: counters[pending.Query].NewCount,
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
                control={<Checkbox checked={true} disabled value="Basic" />}
                label={t("BasicFilterLabel", "Basic")}
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
                label={t("ProperFilterLabel", "Proper")}
              />
              <FormControlLabel
                control={<Checkbox checked={true} disabled value="Idiom" />}
                label={t("IdiomFilterLabel", "Idiom")}
              />
              <FormControlLabel
                control={<Checkbox checked={true} disabled value="Extra" />}
                label={t("ExtraFilterLabel", "Extra")}
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("WordAdder")(WordAdder))
