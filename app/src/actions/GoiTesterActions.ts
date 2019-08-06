import Immutable, { fromJS } from "immutable"
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
} from "../models/GoiSaving"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiDictionarys } from "../models/GoiDictionary"
import { TrimFurigana, AsciiRomaji } from "../utils/GoiJaUtils"
import { TimeStamp } from "../utils/PoiDb"
import Moment from "moment"
import { Action } from "redux"
import Heap from "../algorithm/Heap"
import { RootStateType } from "../states/RootState"
import { ThunkAction } from "redux-thunk"

export const UPDATE_GOI_TESTER_WORD =
  "GOI_TESTER_ACTIONS_CHANGE_GOI_TESTER_WORD"
export const UPDATE_JUDGE_RESULT = "GOI_TESTER_ACTIONS_UPDATE_JUDGE_RESULT"
export const UPDATE_CANDIDATES = "GOI_TESTER_ACTIONS_UPDATE_CANDIDATES"
export const PUSH_CANDIDATE = "GOI_TESTER_ACTIONS_PUSH_CANDIDATE"
export const POP_CANDIDATE = "GOI_TESTER_ACTIONS_POP_CANDIDATE"

export interface UpdateGoiTesterWordActionType
  extends Action<typeof UPDATE_GOI_TESTER_WORD> {
  Word?: GoiWordType
  Record?: GoiWordRecordDataType
}
export interface UpdateJudgeResultActionType
  extends Action<typeof UPDATE_JUDGE_RESULT> {
  JudgeResult: GoiJudgeResult
}

export interface UpdateCandidatesActionType
  extends Action<typeof UPDATE_CANDIDATES> {
  LearnedCandidates?: Heap<GoiWordRecordDataType>
  PrioritiedCandidates?: Heap<GoiWordRecordDataType>
  PendingCandidates?: Heap<GoiWordRecordDataType>
}

export type GoiTesterActionTypes =
  | UpdateGoiTesterWordActionType
  | UpdateJudgeResultActionType
  | UpdateCandidatesActionType

export const UpdateGoiTesterWordAction = ({
  word,
  record,
}: {
  word?: GoiWordType
  record?: GoiWordRecordDataType
}): GoiTesterActionTypes => {
  return {
    type: UPDATE_GOI_TESTER_WORD,
    Word: word,
    Record: record,
  }
}
export const UpdateJudgeResultAction = ({
  judgeResult,
}: {
  judgeResult: GoiJudgeResult
}): UpdateJudgeResultActionType => {
  return {
    type: UPDATE_JUDGE_RESULT,
    JudgeResult: judgeResult,
  }
}
export const UpdateCandidatesAction = ({
  learnedCandidates,
  prioritiedCandidates,
  pendingCandidates,
}: {
  learnedCandidates?: Heap<GoiWordRecordDataType>
  prioritiedCandidates?: Heap<GoiWordRecordDataType>
  pendingCandidates?: Heap<GoiWordRecordDataType>
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
}: {
  learnedCandidate?: GoiWordRecordDataType | null
  prioritiedCandidate?: GoiWordRecordDataType | null
  pendingCandidate?: GoiWordRecordDataType | null
}) => {
  console.debug("DecideNextWord... ")
  if (learnedCandidate) {
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
  console.debug("Reindexing... ")
  const wordRecords = await GoiSaving(poiUserId, savingId).GetRecords()
  console.debug("Records:", wordRecords)
  const learnedCandidates = new Heap<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Level > 0),
    (a, b) => {
      return a.NextTime - b.NextTime
    }
  )
  const prioritiedCandidates = new Heap<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Prioritied),
    (a, b) => {
      return a.Prioritied > b.Prioritied ? 1 : -1
    }
  )
  const pendingCandidates = new Heap<GoiWordRecordDataType>(
    wordRecords.filter(wordRecord => wordRecord.Pending),
    (a, b) => {
      return a.Pending > b.Pending ? 1 : -1
    }
  )
  return { learnedCandidates, prioritiedCandidates, pendingCandidates }
}
const ReindexCandidatesAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}) => {
  return (async dispatch => {
    console.debug("Reindexing... ")
    const wordRecords = await GoiSaving(poiUserId, savingId).GetRecords()
    console.debug("Records:", wordRecords)
    const learnedCandidates = new Heap<GoiWordRecordDataType>(
      wordRecords.filter(wordRecord => wordRecord.Level > 0),
      (a, b) => {
        return a.NextTime - b.NextTime
      }
    )
    const prioritiedCandidates = new Heap<GoiWordRecordDataType>(
      wordRecords.filter(wordRecord => wordRecord.Prioritied),
      (a, b) => {
        return a.Prioritied > b.Prioritied ? 1 : -1
      }
    )
    const pendingCandidates = new Heap<GoiWordRecordDataType>(
      wordRecords.filter(wordRecord => wordRecord.Pending),
      (a, b) => {
        return a.Pending > b.Pending ? 1 : -1
      }
    )
    const { decision } = DecideNextWord({
      learnedCandidate: learnedCandidates.peek(),
      prioritiedCandidate: prioritiedCandidates.peek(),
      pendingCandidate: pendingCandidates.peek(),
    })
    const candidate: GoiWordRecordDataType =
      decision === "leaned" || decision === "steady"
        ? learnedCandidates.poll()!
        : decision === "prioritied"
        ? prioritiedCandidates.poll()!
        : decision === "pending"
        ? pendingCandidates.poll()!
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
  }) as ThunkAction<Promise<unknown>, RootStateType, void, Action>
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
  console.debug("Verifying ja answer...", options)
  const correctAnswers: string[] = [TrimFurigana(jaWord.common)]
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
      const answers = answersGenerator()
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
    jaWord.alternatives.map(furigana => TrimFurigana(furigana))
  )
  decide(options.uncommon!, () =>
    jaWord.uncommon.map(furigana => TrimFurigana(furigana))
  )
  decide(options.kana!, () => [jaWord.kana])
  decide(options.wapuro!, () => [jaWord.wapuro])
  decide(options.romaji!, () => [AsciiRomaji(jaWord.romaji)])
  if (jaWord.pos.startsWith("VERB")) {
    decide(options.keigo!, () =>
      jaWord.katsuyo && jaWord.katsuyo.keigo
        ? [TrimFurigana(jaWord.katsuyo.keigo)]
        : []
    )
  }
  if (correctAnswers.includes(answer)) {
    console.debug("Answer ", answer, " is correct in ", correctAnswers)
    return "Correct"
  }
  if (acceptAnswers.includes(answer)) {
    console.debug("Answer ", answer, " is accepted in ", acceptAnswers)
    return "Accepted"
  }
  if (rejectAnswers.includes(answer)) {
    console.debug("Answer ", answer, " is rejected in ", rejectAnswers)
    return "Rejected"
  }
  console.debug(
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
  answer: string,
  word: GoiWordType,
  options: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
) => {
  return async (dispatch: any): Promise<GoiJudgeResult> => {
    console.debug("Verifying answer... ", answer)
    const poiUserId = options.poiUserId
    const savingId = options.savingId
    const wordKey = word.key
    let judgeResult: GoiJudgeResult = "Wrong"
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
    dispatch(UpdateJudgeResultAction({ judgeResult }))
    const judgeTime = new Date().getTime()
    const recordModel = GoiWordRecord(poiUserId, savingId, wordKey)
    const recordBefore = await recordModel.ReadOrCreate()
    const levelBefore = recordBefore.Level
    const unvalidatedLevelAfter = levelBefore + GetLevelChange(judgeResult)
    const levelAfter =
      unvalidatedLevelAfter <= 1
        ? 1
        : unvalidatedLevelAfter <= levelBefore
        ? unvalidatedLevelAfter
        : judgeTime <= recordBefore.NextTime
        ? levelBefore
        : unvalidatedLevelAfter
    const historyDbKey = await GoiWordHistory(
      poiUserId,
      savingId,
      judgeTime
    ).Create({ wordKey, judgeResult, levelBefore, levelAfter })
    await recordModel.AttachHistory({ judgeTime, historyDbKey })
    await recordModel.SetLevel(levelAfter)
    const nextTime = judgeTime + GetTimeChange(levelAfter)
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
    learnedCandidates?: Heap<GoiWordRecordDataType>
    prioritiedCandidates?: Heap<GoiWordRecordDataType>
    pendingCandidates?: Heap<GoiWordRecordDataType>
  } = {}
) => {
  return (async (dispatch): Promise<void> => {
    console.debug("Showing next word... ")
    if (!learnedCandidates || !prioritiedCandidates || !pendingCandidates) {
      console.debug("No heap found... ")
      ;({
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      } = await ReindexCandidates({ poiUserId, savingId }))
    } else {
      console.debug("Getting candidates from heap... ")
      if (currentWordKey) {
        const currentWordRecord = await GoiWordRecord(
          poiUserId,
          savingId,
          currentWordKey
        ).ReadOrNull()
        if (currentWordRecord && currentWordRecord.Level > 0) {
          learnedCandidates.add(currentWordRecord)
        }
      }
    }
    const { decision } = DecideNextWord({
      learnedCandidate: learnedCandidates.peek(),
      prioritiedCandidate: prioritiedCandidates.peek(),
      pendingCandidate: pendingCandidates.peek(),
    })
    const candidate: GoiWordRecordDataType =
      decision === "leaned" || decision === "steady"
        ? learnedCandidates.poll()!
        : decision === "prioritied"
        ? prioritiedCandidates.poll()!
        : decision === "pending"
        ? pendingCandidates.poll()!
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
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}
