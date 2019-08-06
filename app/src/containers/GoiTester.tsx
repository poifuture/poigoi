import React from "react"
import { connect } from "react-redux"
import JaWordCard from "../components/WordCards/JaWordCard"
import * as PoiUser from "../utils/PoiUser"
import { LazyInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
import {
  VerifyAnswerAction,
  ShowNextWordAction,
} from "../actions/GoiTesterActions"
import { GoiSavingId, GoiJudgeResult } from "../types/GoiTypes"
import Helmet from "react-helmet"
import { GoiWordType, GoiJaWordType } from "../types/GoiDictionaryTypes"
import { RootStateType } from "../states/RootState"
import { ThunkDispatch } from "redux-thunk"
import { Action } from "redux"
import Heap from "../algorithm/Heap"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core"
import SpellcheckIcon from "@material-ui/icons/SpellcheckOutlined"
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturnOutlined"
import RedoIcon from "@material-ui/icons/RedoOutlined"
import ForwardIcon from "@material-ui/icons/ForwardOutlined"
import MoreVertIcon from "@material-ui/icons/MoreVertOutlined"
import MoreHorizIcon from "@material-ui/icons/MoreHorizOutlined"
import { display } from "@material-ui/system"

type GoiTesterPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface GoiTesterStateType {
  testerInput: string
  displayDetail: boolean
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
    }
  }
  JudgeInputElement: HTMLInputElement | null = null
  async componentDidMount() {
    console.debug("Lasy init user")
    const poiUserId = (await this.props.lazyInitUser()) as PoiUser.PoiUserId
    console.debug("Lasy init saving")
    const savingId = await this.props.lazyInitSaving({ poiUserId })
    await this.props.showNextWord({ poiUserId, savingId })
  }
  requestJudge = async ({ skip }: { skip?: boolean } = {}) => {
    const { poiUserId, savingId } = this.props
    const word: GoiJaWordType = this.props.currentWord.toJS()
    const judgeResult = await this.props.judgeAnswer(
      {
        answer: this.state.testerInput,
        word,
        skip,
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
      this.requestNext()
    }
  }
  requestNext = () => {
    const {
      poiUserId,
      savingId,
      currentWordKey,
      learnedCandidates,
      prioritiedCandidates,
      pendingCandidates,
    } = this.props
    this.props.showNextWord(
      { poiUserId, savingId },
      {
        currentWordKey,
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      }
    )
    this.setState({ testerInput: "", displayDetail: false })
  }
  render() {
    const word: GoiJaWordType = this.props.currentWord.toJS()
    const wordCardStatus =
      this.props.judgeResult === "Pending"
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
      this.props.judgeResult === "Pending"
        ? "test-common"
        : this.state.displayDetail
        ? "detailed"
        : "simple"
    return (
      <div className="goi-tester" style={{ marginTop: "20px" }}>
        <Helmet>
          <title>
            {this.props.judgeResult === "Pending"
              ? "PoiGoi"
              : `PoiGoi - ${word.key}`}
          </title>
        </Helmet>
        <div style={{ display: "flex" }}>
          <TextField
            label="Justify your answer"
            variant="outlined"
            value={this.state.testerInput}
            style={{ flexGrow: 1 }}
            onChange={e => {
              this.setState({ testerInput: e.target.value })
            }}
            InputProps={{
              placeholder:
                this.props.judgeResult === "Rejected" ||
                this.props.judgeResult === "Wrong"
                  ? "Type correct answer to continue"
                  : "Type your answer here",
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
              Skip
              <RedoIcon fontSize="small" />
            </Button>
          ) : (
            <Button
              aria-label="Show next word"
              onClick={() => this.requestNext()}
            >
              Skip
              <ForwardIcon fontSize="small" />
            </Button>
          )}
        </div>
        <JaWordCard
          word={word}
          display={wordCardDisplay}
          status={wordCardStatus}
        />
        {!wordCardDisplay.startsWith("test") && (
          <IconButton
            aria-label="detail"
            onClick={() => {
              this.setState({ displayDetail: true })
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  console.debug("GoiTester state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
    currentWord: state.GoiTester.get("CurrentWord"),
    currentWordKey: state.GoiTester.get("CurrentWord").get("key") as string,
    judgeResult: state.GoiTester.get("JudgeResult") as GoiJudgeResult,
    saving: state.GoiSaving.get("Saving"),
    tester: state.GoiTester,
    learnedCandidates: state.GoiTester.get("LearnedCandidates"),
    prioritiedCandidates: state.GoiTester.get("PrioritiedCandidates"),
    pendingCandidates: state.GoiTester.get("PendingCandidates"),
  }
  console.debug("GoiTester props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    lazyInitUser: () => dispatch(LazyInitUserAction()),
    lazyInitSaving: ({ poiUserId }: { poiUserId: PoiUser.PoiUserId }) =>
      dispatch(LazyInitSavingAction({ poiUserId })),
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
        learnedCandidates?: Heap<GoiWordRecordDataType>
        prioritiedCandidates?: Heap<GoiWordRecordDataType>
        pendingCandidates?: Heap<GoiWordRecordDataType>
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
      }: {
        answer: string
        word: GoiWordType
        skip?: boolean
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
        VerifyAnswerAction({ answer, word, skip }, { poiUserId, savingId })
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoiTester)
