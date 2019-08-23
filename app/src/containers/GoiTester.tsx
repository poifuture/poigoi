import React from "react"
import { connect } from "react-redux"
import { TreeMultiSet } from "tstl"
import JaWordCard from "../components/WordCards/JaWordCard"
import * as PoiUser from "../utils/PoiUser"
import { LazyInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
import {
  VerifyAnswerAction,
  ShowNextWordAction,
  UpdateIsTypingAction,
} from "../actions/GoiTesterActions"
import { GoiSavingId, GoiJudgeResult } from "../types/GoiTypes"
import Helmet from "react-helmet"
import { GoiWordType, GoiJaWordType } from "../types/GoiDictionaryTypes"
import { RootStateType } from "../states/RootState"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"
import {
  GoiWordRecordDataType,
  GoiSavingDataType,
  GoiWordRecord,
} from "../models/GoiSaving"
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core"
import SpellcheckIcon from "@material-ui/icons/SpellcheckOutlined"
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturnOutlined"
import RedoIcon from "@material-ui/icons/RedoOutlined"
import ForwardIcon from "@material-ui/icons/ForwardOutlined"
import MoreVertIcon from "@material-ui/icons/MoreVertOutlined"
import MoreHorizIcon from "@material-ui/icons/MoreHorizOutlined"
import LinkOffIcon from "@material-ui/icons/LinkOffOutlined"
import ExposurePlus1Icon from "@material-ui/icons/ExposurePlus1Outlined"
import ExposurePlus2Icon from "@material-ui/icons/ExposurePlus2Outlined"
import ReportProblemIcon from "@material-ui/icons/ReportProblemOutlined"
import { display } from "@material-ui/system"
import { withTranslation, WithTranslation } from "react-i18next"
import DebugModule from "debug"
import { UpdateEnableScrollAction } from "../actions/LayoutActions"
import ResponsiveDialog from "../components/ResponsiveDialog"
const debug = DebugModule("PoiGoi:GoiTester")

type GoiTesterPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation
interface GoiTesterStateType {
  testerInput: string
  displayDetail: boolean
  isReportWordDialogOpened: boolean
}
export class GoiTester extends React.Component<
  GoiTesterPropsType,
  GoiTesterStateType
> {
  constructor(props: GoiTesterPropsType) {
    super(props)
    this.state = {
      testerInput: "",
      displayDetail: false,
      isReportWordDialogOpened: false,
    }
  }
  JudgeInputElement: HTMLInputElement | null = null
  async componentDidMount() {
    debug("Lasy init user")
    const poiUserId = (await this.props.lazyInitUser()) as PoiUser.PoiUserId
    debug("Lasy init saving")
    const savingId = await this.props.lazyInitSaving({ poiUserId })
    await this.props.showNextWord({ poiUserId, savingId })
  }
  requestJudge = async ({
    skip,
    forceLevelChange,
  }: { skip?: boolean; forceLevelChange?: number } = {}) => {
    const { poiUserId, savingId } = this.props
    const word: GoiJaWordType = this.props.currentWord.toJS()
    const judgeResult = await this.props.judgeAnswer(
      {
        answer: this.state.testerInput,
        word,
        skip,
        forceLevelChange,
      },
      {
        poiUserId,
        savingId,
      }
    )
    this.setState({ testerInput: "" })
    if (
      judgeResult === "Correct" ||
      judgeResult === "Accepted" ||
      judgeResult === "Skipped"
    ) {
      await this.requestNext()
    }
  }
  requestNext = async ({ forget }: { forget?: boolean } = {}) => {
    forget = typeof forget !== "undefined" ? forget : false
    const {
      poiUserId,
      savingId,
      currentWordKey,
      learnedCandidates,
      prioritiedCandidates,
      pendingCandidates,
    } = this.props
    if (forget) {
      await GoiWordRecord(poiUserId, savingId, currentWordKey).Forget()
    }
    await this.props.showNextWord(
      { poiUserId, savingId },
      {
        ...(!forget && { currentWordKey }),
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      }
    )
    this.setState({ testerInput: "", displayDetail: false })
  }
  render() {
    const { t, i18n } = this.props
    const word: GoiJaWordType = this.props.currentWord.toJS()
    const savingLanguage =
      this.props.saving && this.props.saving.Language
        ? this.props.saving.Language
        : "en"
    const wordCardStatus =
      this.props.currentLevel === 0
        ? "first"
        : this.props.judgeResult === "Pending"
        ? "input"
        : this.props.judgeResult === "Correct"
        ? "perfect"
        : this.props.judgeResult === "Accepted"
        ? "good"
        : this.props.judgeResult === "Rejected"
        ? "warning"
        : this.props.judgeResult === "Wrong"
        ? "failed"
        : "review"
    const wordCardDisplay =
      this.props.currentLevel === 0
        ? "simple"
        : this.props.judgeResult === "Pending"
        ? "test-common"
        : this.state.displayDetail
        ? "detailed"
        : "simple"
    return (
      <div className="goi-tester">
        <Helmet>
          {savingLanguage.startsWith("ja") ? (
            this.props.judgeResult === "Pending" ? (
              <title>{t("PageTitleWhenEmptyForJaLearner", "PoiGoi")}</title>
            ) : (
              <title>
                {t("PageTitleWhenWordIsDisplayedForJaLearner", {
                  defaultValue: "PoiGoi - {{wordkey}}",
                  wordkey: word.key,
                })}
              </title>
            )
          ) : this.props.judgeResult === "Pending" ? (
            <title>{t("PageTitleWhenEmpty", "PoiGoi")}</title>
          ) : (
            <title>
              {t("PageTitleWhenWordIsDisplayed", {
                defaultValue: "PoiGoi - {{wordkey}}",
                wordkey: word.key,
              })}
            </title>
          )}
        </Helmet>
        <div
          style={{
            height: "50px", // avoid wechat "No password" tip
          }}
        />
        <div style={{ display: "flex" }}>
          <TextField
            label={t("MainInputLabel", "Justify your answer")}
            variant="outlined"
            value={this.state.testerInput}
            style={{ flexGrow: 1 }}
            onFocus={() => {
              this.props.updateIsTyping({ isTyping: true })
            }}
            onBlur={() => {
              this.props.updateIsTyping({ isTyping: false })
            }}
            onChange={e => {
              this.setState({ testerInput: e.target.value })
            }}
            InputProps={{
              placeholder:
                this.props.judgeResult === "Rejected" ||
                this.props.judgeResult === "Wrong"
                  ? t(
                      "MainInputWrongPlaceholder",
                      "Type correct answer to continue"
                    )
                  : savingLanguage.startsWith("ja")
                  ? t(
                      "MainInputPendingPlaceholderForJaLearner",
                      "Use japanese IME"
                    )
                  : t("MainInputPendingPlaceholder", "Type your answer here"),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Request judge"
                    edge="end"
                    onClick={() => this.requestJudge()}
                  >
                    <KeyboardReturnIcon />
                  </IconButton>
                </InputAdornment>
              ),
              onKeyDown: e => {
                if (e.key === "Enter") {
                  this.requestJudge()
                }
              },
            }}
          ></TextField>
          {this.props.judgeResult === "Pending" ? (
            <Button
              size="small"
              aria-label="Skip current word"
              onClick={() => this.requestJudge({ skip: true })}
            >
              {t("SkipWordButtonText", "Skip")}
              <RedoIcon fontSize="small" />
            </Button>
          ) : (
            <Button
              size="small"
              aria-label="Show next word"
              onClick={() => this.requestNext()}
            >
              {t("NextWordButtonText", "Skip")}
              <ForwardIcon fontSize="small" />
            </Button>
          )}
        </div>
        <div
          style={{
            overflowY: "auto",
            maxHeight: this.props.isTyping
              ? "calc(100vh - 120px)"
              : "calc(100vh - 200px)",
          }}
        >
          <JaWordCard
            word={word}
            display={wordCardDisplay}
            status={wordCardStatus}
            {...(this.props.currentLevel !== null && {
              level: this.props.currentLevel,
            })}
          />
        </div>
        {!wordCardDisplay.startsWith("test") && (
          <div
            className="word-card-actions"
            style={{ display: "flex", flexShrink: 0 }}
          >
            {!this.state.displayDetail && (
              <Button
                size="small"
                aria-label="detail"
                onClick={() => {
                  this.setState({ displayDetail: true })
                  // this.props.enableScroll({ enableScroll: true })
                }}
                style={{ color: "gray" }}
              >
                <MoreHorizIcon fontSize="small" />
                {t("WordDetailButtonText", "Detail")}
              </Button>
            )}
            {(this.state.displayDetail ||
              word.pos.includes("DEPRECATED") ||
              word.pos.includes("GAIRAIGO") ||
              word.pos.includes("INTERJ") ||
              word.pos.includes("PROPER") ||
              word.pos.includes("IDIOM")) && (
              <Button
                size="small"
                aria-label="forget"
                onClick={() => {
                  this.requestNext({ forget: true })
                }}
                style={{ color: "gray" }}
              >
                <LinkOffIcon fontSize="small" />
                {t("ForgetWordButtonText", "Forget")}
              </Button>
            )}
            {this.state.displayDetail && this.props.forcedWordKey !== word.key && (
              <Button
                size="small"
                aria-label="level plus one"
                onClick={() => this.requestJudge({ forceLevelChange: 1 })}
                style={{ color: "gray" }}
              >
                <ExposurePlus1Icon fontSize="small" />
                {t("LevelPlusOneButtonText", "Level")}
              </Button>
            )}
            {this.state.displayDetail && this.props.forcedWordKey !== word.key && (
              <Button
                size="small"
                aria-label="level plus two"
                onClick={() => this.requestJudge({ forceLevelChange: 2 })}
                style={{ color: "gray" }}
              >
                <ExposurePlus2Icon fontSize="small" />
                {t("LevelPlusTwoButtonText", "Level")}
              </Button>
            )}
            {this.state.displayDetail && (
              <Button
                size="small"
                aria-label="report wrong word"
                onClick={() => {
                  this.setState({ isReportWordDialogOpened: true })
                }}
                style={{ color: "gray" }}
              >
                <ReportProblemIcon fontSize="small" />
                {t("ReportWordButtonText", "Report")}
              </Button>
            )}
          </div>
        )}
        <ResponsiveDialog open={this.state.isReportWordDialogOpened}>
          {i18n.language.startsWith("zh") ? (
            <iframe
              width="640px"
              height="480px"
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=HO2aql64JEqeASBBMrBBF9_J_XUtkrhFhjg9N756g3xUNTBIMThERkFCT0JDS1JSOFhLSk45WFJKMyQlQCN0PWcu&embed=true"
              frameBorder={0}
              marginWidth={0}
              marginHeight={0}
              style={{ border: "none", maxWidth: "100%", maxHeight: "100vh" }}
              allowFullScreen
            ></iframe>
          ) : (
            <iframe
              width="640px"
              height="480px"
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=HO2aql64JEqeASBBMrBBF9_J_XUtkrhFhjg9N756g3xUQTNBQUU2NllVUzdZRlcxMzM5Tk1JMkREUCQlQCN0PWcu&embed=true"
              frameBorder={0}
              marginWidth={0}
              marginHeight={0}
              style={{ border: "none", maxWidth: "100%", maxHeight: "100vh" }}
              allowFullScreen
            ></iframe>
          )}
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ isReportWordDialogOpened: false })
              }}
            >
              {t("CloseReportWordButtonText", "Close")}
            </Button>
          </DialogActions>
        </ResponsiveDialog>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  debug("GoiTester state: ", state)
  const props = {
    isTyping: state.GoiTester.get("IsTyping") as boolean,
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
    currentWord: state.GoiTester.get("CurrentWord"),
    currentWordKey: state.GoiTester.getIn(["CurrentWord", "key"]) as string,
    currentLevel: state.GoiTester.has("Record")
      ? (state.GoiTester.getIn(["Record", "Level"]) as number)
      : null,
    judgeResult: state.GoiTester.get("JudgeResult") as GoiJudgeResult,
    forcedWordKey: state.GoiTester.get("ForcedWordKey") as string,
    saving: state.GoiSaving.get("Saving") as
      | GoiSavingDataType
      | null
      | undefined,
    learnedCandidates: state.GoiTester.get("LearnedCandidates"),
    prioritiedCandidates: state.GoiTester.get("PrioritiedCandidates"),
    pendingCandidates: state.GoiTester.get("PendingCandidates"),
  }
  debug("GoiTester props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    lazyInitUser: () => dispatch(LazyInitUserAction()),
    lazyInitSaving: ({ poiUserId }: { poiUserId: PoiUser.PoiUserId }) =>
      dispatch(LazyInitSavingAction({ poiUserId })),
    updateIsTyping: ({ isTyping }: { isTyping: boolean }) =>
      dispatch(UpdateIsTypingAction({ isTyping })),
    enableScroll: ({ enableScroll }: { enableScroll: boolean }) =>
      dispatch(UpdateEnableScrollAction({ enableScroll })),
    showNextWord: (
      {
        poiUserId,
        savingId,
      }: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId },
      {
        currentWordKey,
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      }: {
        currentWordKey?: string
        learnedCandidates?: TreeMultiSet<GoiWordRecordDataType>
        prioritiedCandidates?: TreeMultiSet<GoiWordRecordDataType>
        pendingCandidates?: TreeMultiSet<GoiWordRecordDataType>
      } = {}
    ) =>
      dispatch(
        ShowNextWordAction(
          { poiUserId, savingId },
          {
            currentWordKey,
            learnedCandidates,
            prioritiedCandidates,
            pendingCandidates,
          }
        )
      ),
    judgeAnswer: (
      {
        answer,
        word,
        skip,
        forceLevelChange,
      }: {
        answer: string
        word: GoiWordType
        skip?: boolean
        forceLevelChange?: number
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
        VerifyAnswerAction(
          { answer, word, skip, forceLevelChange },
          { poiUserId, savingId }
        )
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("GoiTester")(GoiTester))
