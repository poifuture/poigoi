import Immutable, { fromJS } from "immutable"
import SortedArray from "collections/sorted-array"
import { GoiWordType, GoiJaWordType } from "../types/GoiDictionaryTypes"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId, GoiJudgeResult } from "../types/GoiTypes"
import {
  GoiSavingModel,
  GoiSaving,
  GoiWordRecord,
  GoiWordRecordModel,
  GoiWordRecordDataType,
  GoiWordHistory,
  BulkGetWordRecords,
} from "../models/GoiSaving"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiDictionarys } from "../models/GoiDictionary"
import { TrimFurigana, AsciiRomaji } from "../utils/GoiJaUtils"
import { TimeStamp } from "../utils/PoiDb"
import Moment from "moment"
import { Action } from "redux"
import { RootStateType } from "../states/RootState"
import { ThunkAction } from "redux-thunk"
import DebugModule from "debug"
import { UpdateEnableScrollAction } from "./LayoutActions"
import {
  NewWordsOrderType,
  RevisitStrategyType,
} from "../states/GoiSettingsState"
const debug = DebugModule("PoiGoi:GoiTesterActions")

export const UPDATE_IS_TYPING = "GOI_TESTER_ACTIONS_UPDATE_IS_TYPING"
export const UPDATE_GOI_TESTER_WORD =
  "GOI_TESTER_ACTIONS_CHANGE_GOI_TESTER_WORD"
export const UPDATE_JUDGE_RESULT = "GOI_TESTER_ACTIONS_UPDATE_JUDGE_RESULT"
export const UPDATE_CANDIDATES = "GOI_TESTER_ACTIONS_UPDATE_CANDIDATES"
export const PUSH_CANDIDATE = "GOI_TESTER_ACTIONS_PUSH_CANDIDATE"
export const POP_CANDIDATE = "GOI_TESTER_ACTIONS_POP_CANDIDATE"

export interface UpdateIsTypingActionType
  extends Action<typeof UPDATE_IS_TYPING> {
  IsTyping: boolean
}
export interface UpdateGoiTesterWordActionType
  extends Action<typeof UPDATE_GOI_TESTER_WORD> {
  Word?: GoiWordType
  Record?: GoiWordRecordDataType
}
export interface UpdateJudgeResultActionType
  extends Action<typeof UPDATE_JUDGE_RESULT> {
  JudgeResult: GoiJudgeResult
  ForcedWordKey?: string
}

export interface UpdateCandidatesActionType
  extends Action<typeof UPDATE_CANDIDATES> {
  LearnedCandidates?: SortedArray<GoiWordRecordDataType>
  PrioritiedCandidates?: SortedArray<GoiWordRecordDataType>
  PendingCandidates?: SortedArray<GoiWordRecordDataType>
}

export type GoiTesterActionTypes =
  | UpdateIsTypingActionType
  | UpdateGoiTesterWordActionType
  | UpdateJudgeResultActionType
  | UpdateCandidatesActionType

export const UpdateIsTypingAction = ({
  isTyping,
}: {
  isTyping: boolean
}): UpdateIsTypingActionType => {
  return {
    type: UPDATE_IS_TYPING,
    IsTyping: isTyping,
  }
}

export const UpdateGoiTesterWordAction = ({
  word,
  record,
}: {
  word?: GoiWordType
  record?: GoiWordRecordDataType
}): UpdateGoiTesterWordActionType => {
  return {
    type: UPDATE_GOI_TESTER_WORD,
    Word: word,
    Record: record,
  }
}
export const UpdateJudgeResultAction = ({
  judgeResult,
  forcedWordKey,
}: {
  judgeResult: GoiJudgeResult
  forcedWordKey?: string
}): UpdateJudgeResultActionType => {
  return {
    type: UPDATE_JUDGE_RESULT,
    JudgeResult: judgeResult,
    ForcedWordKey: forcedWordKey,
  }
}
export const UpdateCandidatesAction = ({
  learnedCandidates,
  prioritiedCandidates,
  pendingCandidates,
}: {
  learnedCandidates?: SortedArray<GoiWordRecordDataType>
  prioritiedCandidates?: SortedArray<GoiWordRecordDataType>
  pendingCandidates?: SortedArray<GoiWordRecordDataType>
}): GoiTesterActionTypes => {
  return {
    type: UPDATE_CANDIDATES,
    LearnedCandidates: learnedCandidates,
    PrioritiedCandidates: prioritiedCandidates,
    PendingCandidates: pendingCandidates,
  }
}

export const DecideNextWord = ({
  learnedCandidate,
  prioritiedCandidate,
  pendingCandidate,
  revisitStrategy,
}: {
  learnedCandidate?: GoiWordRecordDataType | null
  prioritiedCandidate?: GoiWordRecordDataType | null
  pendingCandidate?: GoiWordRecordDataType | null
  revisitStrategy: RevisitStrategyType
}) => {
  debug("DecideNextWord... ")
  if (learnedCandidate && revisitStrategy !== "NoRevisit") {
    if (learnedCandidate.NextTime < new Date().getTime()) {
      return { candidate: learnedCandidate, decision: "leaned" }
    }
  }
  if (prioritiedCandidate) {
    return { candidate: prioritiedCandidate, decision: "prioritied" }
  }
  if (pendingCandidate) {
    return { candidate: pendingCandidate, decision: "pending" }
  }
  if (learnedCandidate) {
    return { candidate: learnedCandidate, decision: "steady" }
  }
  return { candidate: null, decision: "none" }
}

export const ReindexCandidates = async ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}) => {
  debug("Reindexing... ")
  const wordRecords = Object.values(
    await BulkGetWordRecords({ poiUserId, savingId })
  )
  debug("Records:", wordRecords)
  const learnedCandidates = new SortedArray<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Level > 0),
    (a, b) => a.NextTime === b.NextTime,
    (a, b) => {
      return a.NextTime - b.NextTime
    }
  )
  const prioritiedCandidates = new SortedArray<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Prioritied),
    (a, b) => a.Prioritied === b.Prioritied,
    (a, b) => {
      return a.Prioritied > b.Prioritied ? 1 : -1
    }
  )
  const pendingCandidates = new SortedArray<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Pending),
    (a, b) => a.Pending === b.Pending,
    (a, b) => {
      return a.Pending > b.Pending ? 1 : -1
    }
  )
  return { learnedCandidates, prioritiedCandidates, pendingCandidates }
}

export const VerifyJaAnswer = (
  answer: string,
  jaWord: GoiJaWordType,
  options?: {
    alternatives?: GoiJudgeResult
    uncommon?: GoiJudgeResult
    kana?: GoiJudgeResult
    wapuro?: GoiJudgeResult
    romaji?: GoiJudgeResult
    keigo?: GoiJudgeResult
  }
): GoiJudgeResult => {
  options = {
    alternatives: "Accepted",
    uncommon: "Rejected",
    kana: "Accepted",
    wapuro: "Accepted",
    romaji: "Rejected",
    keigo: "Rejected",
    ...options,
  }
  answer = answer.toLowerCase().trim()
  debug("Verifying ja answer...", options)
  const correctAnswers: string[] = [TrimFurigana(jaWord.common).toLowerCase()]
  const acceptAnswers: string[] = []
  const rejectAnswers: string[] = []
  const decide = (
    decider: GoiJudgeResult,
    answersGenerator: () => string[]
  ) => {
    if (
      decider === "Correct" ||
      decider === "Accepted" ||
      decider === "Rejected"
    ) {
      const answers = answersGenerator().filter(answer => !!answer) // filter empty answers
      if (decider === "Correct") {
        correctAnswers.push(...answers)
      }
      if (decider === "Accepted") {
        acceptAnswers.push(...answers)
      }
      if (decider === "Rejected") {
        rejectAnswers.push(...answers)
      }
    }
  }
  decide(options.alternatives!, () =>
    jaWord.alternatives.map(furigana => TrimFurigana(furigana).toLowerCase())
  )
  decide(options.uncommon!, () =>
    jaWord.uncommons.map(furigana => TrimFurigana(furigana).toLowerCase())
  )
  decide(options.kana!, () => [jaWord.kana])
  decide(options.wapuro!, () => [jaWord.wapuro.toLowerCase()])
  decide(options.romaji!, () => [AsciiRomaji(jaWord.romaji).toLowerCase()])
  if (jaWord.pos.includes("VERB")) {
    decide(options.keigo!, () =>
      jaWord.katsuyo && jaWord.katsuyo.keigo
        ? [TrimFurigana(jaWord.katsuyo.keigo).toLowerCase()]
        : []
    )
  }
  if (correctAnswers.includes(answer)) {
    debug("Answer ", answer, " is correct in ", correctAnswers)
    return "Correct"
  }
  if (acceptAnswers.includes(answer)) {
    debug("Answer ", answer, " is accepted in ", acceptAnswers)
    return "Accepted"
  }
  if (rejectAnswers.includes(answer)) {
    debug("Answer ", answer, " is rejected in ", rejectAnswers)
    return "Rejected"
  }
  debug(
    "Answer ",
    answer,
    " is wrong. No match in ",
    correctAnswers,
    acceptAnswers,
    rejectAnswers
  )
  return "Wrong"
}
const GetLevelChange = (judgeResult: GoiJudgeResult) => {
  switch (judgeResult) {
    case "Correct":
    case "Accepted": {
      return +1
    }
    case "Rejected":
    case "Wrong": {
      return -1
    }
    case "Skipped":
    case "Forced":
    default: {
      return 0
    }
  }
}
const GetTimeChange = (level: number) => {
  const GetBasicTimeChange = () => {
    if (level > 7) {
      return Moment.duration(10, "year")
    }
    switch (level) {
      case 7: {
        return Moment.duration(1, "year")
      }
      case 6: {
        return Moment.duration(1, "month")
      }
      case 5: {
        return Moment.duration(1, "week")
      }
      case 4: {
        return Moment.duration(1, "day")
      }
      case 3: {
        return Moment.duration(1, "hour")
      }
      case 2: {
        return Moment.duration(10, "minutes")
      }
      case 1: {
        return Moment.duration(5, "minutes")
      }
      default: {
        return Moment.duration(1, "minute")
      }
    }
  }
  const basicTimeChange = GetBasicTimeChange().asMilliseconds()
  const timeChange = Math.floor(basicTimeChange * (1 + Math.random() * 0.2))
  return timeChange
}
export const VerifyAnswerAction = (
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
) => {
  return async (dispatch: any): Promise<GoiJudgeResult> => {
    skip = typeof skip !== "undefined" ? skip : false
    forceLevelChange =
      typeof forceLevelChange !== "undefined" ? forceLevelChange : 0
    debug("Verifying answer... ", answer)
    const wordKey = word.key
    let judgeResult: GoiJudgeResult = "Wrong"
    if (skip) {
      debug("Skipping word... ")
      judgeResult = "Skipped"
    } else if (forceLevelChange) {
      debug("Forcing level change... ", forceLevelChange)
      judgeResult = "Forced"
    } else {
      switch (word.language) {
        case "ja":
        case "ja-jp": {
          // read options
          judgeResult = VerifyJaAnswer(answer, word as GoiJaWordType)
          break
        }
        default: {
          throw new Error(
            `Unkown language ${word.language} for ${word.key} (${word.common})`
          )
        }
      }
    }
    dispatch(
      UpdateJudgeResultAction({
        judgeResult,
        ...(judgeResult === "Forced" && { forcedWordKey: wordKey }),
      })
    )
    const judgeTime = new Date().getTime()
    const recordModel = GoiWordRecord(poiUserId, savingId, wordKey)
    const recordBefore = await recordModel.ReadOrCreate()
    const levelBefore = recordBefore.Level
    const unvalidatedLevelAfter =
      levelBefore + GetLevelChange(judgeResult) + forceLevelChange
    const levelAfter =
      unvalidatedLevelAfter < 1
        ? 1
        : forceLevelChange
        ? unvalidatedLevelAfter
        : judgeTime <= recordBefore.FrozenTime
        ? levelBefore
        : unvalidatedLevelAfter <= levelBefore
        ? unvalidatedLevelAfter
        : unvalidatedLevelAfter
    debug("Judge time:", judgeTime, "frozen time:", recordBefore.FrozenTime)
    debug("frozen:", judgeTime <= recordBefore.FrozenTime)
    debug("Level before:", levelBefore, "level after:", levelAfter)
    const historyDbKey = await GoiWordHistory(
      poiUserId,
      savingId,
      judgeTime
    ).Create({ wordKey, judgeResult, levelBefore, levelAfter })
    await recordModel.AttachHistory({ judgeTime, historyDbKey })
    const timeChange = GetTimeChange(levelAfter)
    const potentialFrozenTime = judgeTime + timeChange
    const nextTime =
      potentialFrozenTime + Math.floor(timeChange * Math.random())
    if (levelBefore !== levelAfter) {
      await recordModel.SetLevel(levelAfter)
      debug("Setting frozen time...", potentialFrozenTime)
      await recordModel.SetFrozenTime(potentialFrozenTime)
    }
    await recordModel.SetNextTime(nextTime)
    const record = await recordModel.Read()
    dispatch(UpdateGoiTesterWordAction({ record }))
    return judgeResult
  }
}

export const ShowNextWordAction = (
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  {
    currentWordKey,
    learnedCandidates,
    prioritiedCandidates,
    pendingCandidates,
  }: {
    currentWordKey?: string
    learnedCandidates?: SortedArray<GoiWordRecordDataType>
    prioritiedCandidates?: SortedArray<GoiWordRecordDataType>
    pendingCandidates?: SortedArray<GoiWordRecordDataType>
  } = {}
) => {
  return (async (dispatch, getState): Promise<void> => {
    debug("Showing next word... ")
    if (!learnedCandidates || !prioritiedCandidates || !pendingCandidates) {
      debug("No heap found... ")
      ;({
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      } = await ReindexCandidates({ poiUserId, savingId }))
    } else {
      debug("Getting candidates from heap... ")
      if (currentWordKey) {
        const currentWordRecord = await GoiWordRecord(
          poiUserId,
          savingId,
          currentWordKey
        ).ReadOrNull()
        if (currentWordRecord) {
          if (currentWordRecord.Level > 0) {
            learnedCandidates.add(currentWordRecord)
          }
          if (currentWordRecord.Level === 0) {
            if (currentWordRecord.Prioritied) {
              prioritiedCandidates.add(currentWordRecord)
            } else if (currentWordRecord.Pending) {
              pendingCandidates.add(currentWordRecord)
            }
          }
        }
      }
    }
    const revisitStrategy = getState().GoiSettings.get(
      "RevisitStrategy"
    ) as RevisitStrategyType
    const { decision } = DecideNextWord({
      learnedCandidate: learnedCandidates.min(),
      prioritiedCandidate: prioritiedCandidates.min(),
      pendingCandidate: pendingCandidates.min(),
      revisitStrategy,
    })
    const newWordOrder = getState().GoiSettings.get(
      "NewWordsOrder"
    ) as NewWordsOrderType
    const popRandomOne = async (
      candidates: SortedArray<GoiWordRecordDataType>
    ) => {
      if (candidates.length === 0) {
        return await GoiWordRecord(poiUserId, savingId, "あ").ReadOrCreate()
      }
      const randIndex = Math.round(Math.random() * candidates.length)
      const one = candidates.slice(randIndex, randIndex + 1)[0]
      candidates.deleteAll(one, (a, b) => a.WordKey === b.WordKey)
      return one
    }
    const candidate: GoiWordRecordDataType =
      decision === "leaned"
        ? learnedCandidates.shift()!
        : decision === "prioritied"
        ? newWordOrder === "Ordered"
          ? prioritiedCandidates.shift()!
          : await popRandomOne(prioritiedCandidates)
        : decision === "pending"
        ? newWordOrder === "Ordered"
          ? pendingCandidates.shift()!
          : await popRandomOne(pendingCandidates)
        : decision === "steady"
        ? learnedCandidates.shift()!
        : await GoiWordRecord(poiUserId, savingId, "あ").ReadOrCreate()
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const dictionaryWord =
      (await GoiDictionarys(dictionarys).GetWordOrNull(candidate.WordKey)) ||
      KanaDictionary.words["あ"]
    dispatch(
      UpdateGoiTesterWordAction({ word: dictionaryWord, record: candidate })
    )
    dispatch(
      UpdateCandidatesAction({
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      })
    )
    dispatch(UpdateJudgeResultAction({ judgeResult: "Pending" }))
    dispatch(UpdateEnableScrollAction({ enableScroll: false }))
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}
