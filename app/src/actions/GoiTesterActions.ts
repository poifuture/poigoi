import Immutable, { fromJS } from "immutable"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import {
  GoiSavingModel,
  GoiSaving,
  GoiWordRecord,
  GoiWordRecordModel,
  GoiWordRecordDataType,
} from "../models/GoiSaving"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiDictionarys } from "../models/GoiDictionary"

export const UPDATE_GOI_TESTER_WORD =
  "GOI_TESTER_ACTIONS_CHANGE_GOI_TESTER_WORD"
export const UPDATE_CANDIDATES = "GOI_TESTER_ACTIONS_UPDATE_CANDIDATES"

export interface UpdateGoiTesterWordActionType {
  type: typeof UPDATE_GOI_TESTER_WORD
  Word: GoiWordType
}

export interface UpdateCandidatesActionType {
  type: typeof UPDATE_CANDIDATES
  LearnedCandidates?: GoiWordRecordDataType[]
  PrioritiedCandidates?: GoiWordRecordDataType[]
  PendingCandidates?: GoiWordRecordDataType[]
}

export type GoiTesterActionTypes =
  | UpdateGoiTesterWordActionType
  | UpdateCandidatesActionType

export function UpdateGoiTesterWordAction(
  newWord: GoiWordType
): GoiTesterActionTypes {
  return {
    type: UPDATE_GOI_TESTER_WORD,
    Word: newWord,
  }
}
export function UpdateCandidatesAction(
  learnedCandidates?: GoiWordRecordDataType[],
  prioritiedCandidates?: GoiWordRecordDataType[],
  pendingCandidates?: GoiWordRecordDataType[]
): GoiTesterActionTypes {
  return {
    type: UPDATE_CANDIDATES,
    LearnedCandidates: learnedCandidates,
    PrioritiedCandidates: prioritiedCandidates,
    PendingCandidates: pendingCandidates,
  }
}
const getPoiUserId = (state: any): PoiUser.PoiUserId => {
  return state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId
}
const getSavingId = (state: any): GoiSavingId => {
  return state.GoiSaving.get("SavingId") as GoiSavingId
}
const getDictionarys = (state: any): string[] => {
  return state.GoiSaving.get("Saving")
    .get("Dictionarys")
    .toJS() as string[]
}

export function RenewCurrentWordAction(options?: {
  learnedCandidate?: GoiWordRecordDataType
  prioritiedCandidate?: GoiWordRecordDataType
  pendingCandidate?: GoiWordRecordDataType
  dictionarys?: string[]
}) {
  return async (dispatch: any, getState: any): Promise<void> => {
    options = options || {}
    console.debug("Reindexing... ")
    const state = getState()
    const learnedCandidate = options.learnedCandidate
    const prioritiedCandidate = options.prioritiedCandidate
    const pendingCandidate = options.pendingCandidate
    const dictionarys = options.dictionarys || getDictionarys(state)
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

export function ReindexCandidatesAction(
  poiUserId?: PoiUser.PoiUserId,
  savingId?: GoiSavingId
) {
  return async (dispatch: any, getState: any): Promise<void> => {
    console.debug("Reindexing... ")
    const state = getState()
    poiUserId = poiUserId || getPoiUserId(state)
    savingId = savingId || getSavingId(state)
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
      UpdateCandidatesAction(
        learnedCandidates,
        prioritiedCandidates,
        pendingCandidates
      )
    )
  }
}
