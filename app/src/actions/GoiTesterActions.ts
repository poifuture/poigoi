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
} from "../models/GoiSaving"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiDictionarys } from "../models/GoiDictionary"
import { TrimFurigana, AsciiRomaji } from "../utils/GoiJaUtils"
import { TimeStamp } from "../utils/PoiDb"
import Moment from "moment"
import { Action } from "redux"

export const UPDATE_GOI_TESTER_WORD =
  "GOI_TESTER_ACTIONS_CHANGE_GOI_TESTER_WORD"
export const UPDATE_CANDIDATES = "GOI_TESTER_ACTIONS_UPDATE_CANDIDATES"
export const UPDATE_JUDGE_RESULT = "GOI_TESTER_ACTIONS_UPDATE_JUDGE_RESULT"

export interface UpdateGoiTesterWordActionType
  extends Action<typeof UPDATE_GOI_TESTER_WORD> {
  Word: GoiWordType
}
export interface UpdateJudgeResultActionType
  extends Action<typeof UPDATE_JUDGE_RESULT> {
  JudgeResult: GoiJudgeResult
}

export interface UpdateCandidatesActionType
  extends Action<typeof UPDATE_CANDIDATES> {
  LearnedCandidates?: GoiWordRecordDataType[]
  PrioritiedCandidates?: GoiWordRecordDataType[]
  PendingCandidates?: GoiWordRecordDataType[]
}

export type GoiTesterActionTypes =
  | UpdateGoiTesterWordActionType
  | UpdateJudgeResultActionType
  | UpdateCandidatesActionType

export const UpdateGoiTesterWordAction = (
  newWord: GoiWordType
): GoiTesterActionTypes => {
  return {
    type: UPDATE_GOI_TESTER_WORD,
    Word: newWord,
  }
}
export const UpdateJudgeResultAction = (
  judgeResult: GoiJudgeResult
): UpdateJudgeResultActionType => {
  return {
    type: UPDATE_JUDGE_RESULT,
    JudgeResult: judgeResult,
  }
}
export const UpdateCandidatesAction = (options: {
  learnedCandidates?: GoiWordRecordDataType[]
  prioritiedCandidates?: GoiWordRecordDataType[]
  pendingCandidates?: GoiWordRecordDataType[]
}): GoiTesterActionTypes => {
  return {
    type: UPDATE_CANDIDATES,
    LearnedCandidates: options.learnedCandidates,
    PrioritiedCandidates: options.prioritiedCandidates,
    PendingCandidates: options.pendingCandidates,
  }
}

export const RenewCurrentWordAction = (options: {
  learnedCandidate?: GoiWordRecordDataType
  prioritiedCandidate?: GoiWordRecordDataType
  pendingCandidate?: GoiWordRecordDataType
  dictionarys: string[]
}) => {
  return async (dispatch: any, getState: any): Promise<void> => {
    console.debug("Reindexing... ")
    const learnedCandidate = options.learnedCandidate
    const prioritiedCandidate = options.prioritiedCandidate
    const pendingCandidate = options.pendingCandidate
    const dictionarys = options.dictionarys
    let candidate: GoiWordRecordDataType | null = null
    if (learnedCandidate) {
      if (learnedCandidate.NextTime < new Date().getTime()) {
        candidate = learnedCandidate
      }
    }
    if (!candidate && prioritiedCandidate) {
      candidate = prioritiedCandidate
    }
    if (!candidate && pendingCandidate) {
      candidate = pendingCandidate
    }
    if (!candidate && learnedCandidate) {
      candidate = learnedCandidate
    }
    const wordKey = candidate ? candidate.WordKey : "あ"
    const lookupDictionaryWord = await GoiDictionarys(
      dictionarys
    ).GetWordOrNull(wordKey)
    const dictionaryWord = lookupDictionaryWord || KanaDictionary.words["あ"]
    dispatch(UpdateGoiTesterWordAction(dictionaryWord))
  }
}

export const ReindexCandidatesAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any): Promise<void> => {
    console.debug("Reindexing... ")
    const wordRecords = await GoiSaving(poiUserId, savingId).GetRecords()
    console.debug("Records:", wordRecords)
    const learnedCandidates = wordRecords
      .filter(wordRecord => wordRecord.Level > 0)
      .sort((a, b) => {
        // ascending
        return a.NextTime - b.NextTime
      })
    const prioritiedCandidates = wordRecords
      .filter(wordRecord => wordRecord.Prioritized)
      .sort((a, b) => {
        return a.Prioritized > b.Prioritized ? 1 : -1
      })
    const pendingCandidates = wordRecords
      .filter(wordRecord => wordRecord.Pending)
      .sort((a, b) => {
        return a.Pending > b.Pending ? 1 : -1
      })
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    dispatch(
      RenewCurrentWordAction({
        ...(learnedCandidates.length > 0 && {
          learnedCandidate: learnedCandidates[0],
        }),
        ...(prioritiedCandidates.length > 0 && {
          prioritiedCandidate: prioritiedCandidates[0],
        }),
        ...(pendingCandidates.length > 0 && {
          pendingCandidate: pendingCandidates[0],
        }),
        dictionarys,
      })
    )
    dispatch(
      UpdateCandidatesAction({
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates,
      })
    )
  }
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
  const basicTimeChange = GetBasicTimeChange().asSeconds()
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
    dispatch(UpdateJudgeResultAction(judgeResult))
    const recordModel = GoiWordRecord(poiUserId, savingId, wordKey)
    const levelBefore = await recordModel.GetLevel()
    const levelChange = GetLevelChange(judgeResult)
    const unvalidatedLevelAfter = levelBefore + levelChange
    const levelAfter = unvalidatedLevelAfter > 1 ? unvalidatedLevelAfter : 1
    await recordModel.CreateHistory(judgeResult, levelBefore, levelAfter)
    const nextTime = new Date().getTime() + GetTimeChange(levelAfter)
    await recordModel.SetNextTime(nextTime)

    return judgeResult
  }
}
