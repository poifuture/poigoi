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

export class GoiTester extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  JudgeInputElement: HTMLInputElement | null = null
  async componentDidMount() {
    console.debug("Lasy init user")
    const poiUserId = (await this.props.lazyInitUser()) as PoiUser.PoiUserId
    console.debug("Lasy init saving")
    const savingId = await this.props.lazyInitSaving({ poiUserId })
    await this.props.showNextWord({ poiUserId, savingId })
  }
  onRequestJudge = () => {
    if (!this.JudgeInputElement || !this.JudgeInputElement.value) {
      return
    }
    const poiUserId = this.props.poiUserId
    const savingId = this.props.savingId
    const word: GoiJaWordType = this.props.currentWord.toJS()
    this.props.judgeAnswer(this.JudgeInputElement.value, word, {
      poiUserId,
      savingId,
    })
  }
  onRequestNext = () => {
    if (this.props.judgeResult === "Pending") {
      //store skip result
    }
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
    return (
      <div className="goi-tester">
        <Helmet>
          <title>{word.key || "PoiGoi"}</title>
        </Helmet>
        <input ref={c => (this.JudgeInputElement = c)}></input>
        <button onClick={this.onRequestJudge}>Judge</button>
        <button onClick={this.onRequestNext}>Next</button>
        <JaWordCard word={word} display="detailed" status={wordCardStatus} />
        <pre className="goi-debug"></pre>
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
      answer: string,
      word: GoiWordType,
      options: { poiUserId: PoiUser.PoiUserId; savingId: GoiSavingId }
    ) =>
      dispatch(
        VerifyAnswerAction(answer, word, {
          poiUserId: options.poiUserId,
          savingId: options.savingId,
        })
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoiTester)
