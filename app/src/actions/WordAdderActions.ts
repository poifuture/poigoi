import {
  WordAdderStateType,
  WordAdderPendingQueryType,
  WordAdderSuggestionQueryType,
} from "../states/WordAdderState"
import { GoiDictionarys } from "../models/GoiDictionary"
import Immutable from "immutable"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import * as PoiUser from "../utils/PoiUser"
import {
  GoiWordRecord,
  GoiWordRecordModel,
  GoiWordRecordDataType,
  GoiSaving,
  GoiSavingModel,
} from "../models/GoiSaving"
import { GoiSavingId } from "../types/GoiTypes"

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const UPDATE_STATUS = "WORD_ADDER_ACTIONS_UPDATE_STATUS"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"
export const PUSH_COUNT_QUERY = "WORD_ADDER_ACTIONS_PUSH_COUNT_QUERY"

export interface DisplayWordAdderActionType {
  type: typeof DISPLAY_WORD_ADDER
  Display: boolean
}

export interface UpdateStatusActionType {
  type: typeof UPDATE_STATUS
  LearnedCount: number
  PrioritizedCount: number
  PendingCount: number
}

export interface PushPendingQueryActionType {
  type: typeof PUSH_PENDING_QUERY
  Display: string
  Query: string
}
export interface PopPendingQueryActionType {
  type: typeof POP_PENDING_QUERY
  Query: string
}

export interface PushCountQueryActionType {
  type: typeof PUSH_COUNT_QUERY
  Query: string
  TotalCount: number
  LearnedCount: number
  AddedCount: number
  NewCount: number
}

export type WordAdderActionsType =
  | DisplayWordAdderActionType
  | UpdateStatusActionType
  | PushPendingQueryActionType
  | PopPendingQueryActionType
  | PushCountQueryActionType

export const DisplayWordAdderAction = (
  display: boolean = true
): DisplayWordAdderActionType => {
  return {
    type: DISPLAY_WORD_ADDER,
    Display: display,
  }
}

const UpdateStatusAction = (
  learnedCount: number,
  prioritizedCount: number,
  pendingCount: number
): UpdateStatusActionType => {
  return {
    type: UPDATE_STATUS,
    LearnedCount: learnedCount,
    PrioritizedCount: prioritizedCount,
    PendingCount: pendingCount,
  }
}

const CountStatusAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any): Promise<void> => {
    console.debug("Counting status... ")
    const wordRecords = await GoiSaving(poiUserId, savingId).GetRecords()
    console.debug("Records:", wordRecords)
    const learnedCount = wordRecords.filter(wordRecord => wordRecord.Level > 0)
      .length
    const prioritizedCount = wordRecords.filter(
      wordRecord => !(wordRecord.Level > 0) && wordRecord.Prioritized
    ).length
    const pendingCount = wordRecords.filter(
      wordRecord =>
        !(wordRecord.Level > 0) && !wordRecord.Prioritized && wordRecord.Pending
    ).length
    dispatch(UpdateStatusAction(learnedCount, prioritizedCount, pendingCount))
  }
}

const PushCountQueryAction = (
  query: string,
  totalCount: number,
  learnedCount: number,
  addedCount: number,
  newCount: number
): PushCountQueryActionType => {
  return {
    type: PUSH_COUNT_QUERY,
    Query: query,
    TotalCount: totalCount,
    LearnedCount: learnedCount,
    AddedCount: addedCount,
    NewCount: newCount,
  }
}
const queryWords = async (
  query: string,
  dictionarys: string[],
  options?: { wordKeys?: Immutable.Set<string> }
): Promise<{ [key: string]: GoiWordType }> => {
  const fullOptions = {
    wordKeys: null,
    ...options,
  }
  console.debug("Query words... ", query)
  const wordKeys = fullOptions.wordKeys
    ? fullOptions.wordKeys
    : await GoiDictionarys(dictionarys).GetAllWordsKeys()
  console.debug("AllWordKeys", wordKeys)
  const queryRegExp = new RegExp(query)
  const words: { [key: string]: GoiWordType } = Object.fromEntries(
    (await Promise.all(
      wordKeys.map(async wordKey => {
        const word = await GoiDictionarys(dictionarys).GetWordOrNull(wordKey)
        if (!word) {
          return null
        }
        const matches = word.textbook.filter(tag => tag.match(queryRegExp))
        if (matches.length === 0) {
          return null
        }
        return [wordKey, word]
      })
    )).filter(
      (wordEntry): wordEntry is [string, GoiWordType] => wordEntry !== null
    )
  )
  return words
}

const CountQueryAction = (
  query: string,
  options: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
    wordKeys?: Immutable.Set<string>
  }
) => {
  return async (dispatch: any): Promise<void> => {
    const poiUserId = options.poiUserId
    const savingId = options.savingId
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    console.debug("Counting Query... ", query)
    const words = await queryWords(query, dictionarys, {
      wordKeys: options.wordKeys,
    })
    const wordRecords = (await Promise.all(
      Object.keys(words).map(
        async wordKey =>
          await GoiWordRecord(poiUserId, savingId, wordKey).ReadOrNull()
      )
    )).filter(
      (
        wordRecord
      ): wordRecord is GoiWordRecordDataType &
        PouchDB.Core.IdMeta &
        PouchDB.Core.GetMeta => wordRecord !== null
    )
    const totalCount = Object.keys(words).length
    const learnedCount = wordRecords.filter(wordRecord => wordRecord.Level > 0)
      .length
    const addedCount = wordRecords.filter(
      wordRecord =>
        !(wordRecord.Level > 0) &&
        (wordRecord.Prioritized || wordRecord.Pending)
    ).length
    const newCount = totalCount - learnedCount - addedCount
    dispatch(
      PushCountQueryAction(
        query,
        totalCount,
        learnedCount,
        addedCount,
        newCount
      )
    )
  }
}

const getDictionarys = (state: any): string[] => {
  try {
    return state.GoiSaving.get("Saving").Dictionarys
  } catch (error) {
    console.error(error)
  }
  return ["KanaDictionary", "SimpleJaDictionary"]
}

const getSuggestionQuerysFromState = (state: any): string[] => {
  const suggestionQuerys = state.WordAdder.get(
    "Suggestions"
  ).toJS() as WordAdderSuggestionQueryType[]
  return suggestionQuerys.map(suggestion => suggestion.Query)
}
const getPendingQuerysFromState = (state: any): string[] => {
  const pendingQuerys = state.WordAdder.get(
    "Pendings"
  ).toJS() as WordAdderPendingQueryType[]
  return pendingQuerys.map(pending => pending.Query)
}

export const RefreshWordAdderFromStateAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any, getState: any): Promise<void> => {
    dispatch(CountStatusAction(poiUserId, savingId))
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    const state = getState()
    Immutable.Set.of(
      ...getSuggestionQuerysFromState(state),
      ...getPendingQuerysFromState(state)
    ).map(query =>
      dispatch(CountQueryAction(query, { poiUserId, savingId, wordKeys }))
    )
  }
}

export const ShowWordAdderAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any): Promise<void> => {
    dispatch(DisplayWordAdderAction(true))
    await dispatch(RefreshWordAdderFromStateAction(poiUserId, savingId))
  }
}

const PushPendingQueryAction = (
  display: string,
  query: string
): PushPendingQueryActionType => {
  return {
    type: PUSH_PENDING_QUERY,
    Display: display,
    Query: query,
  }
}
const PopPendingQueryAction = (query: string): PopPendingQueryActionType => {
  return {
    type: POP_PENDING_QUERY,
    Query: query,
  }
}

export const AddPendingQueryAction = (
  display: string,
  query: string,
  options: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
) => {
  return async (dispatch: any): Promise<void> => {
    const poiUserId = options.poiUserId
    const savingId = options.savingId
    dispatch(CountQueryAction(query, { poiUserId, savingId }))
    dispatch(PushPendingQueryAction(display, query))
  }
}

export const RemovePendingQueryAction = (query: string) => {
  return async (dispatch: any): Promise<void> => {
    dispatch(PopPendingQueryAction(query))
  }
}

const AddWordsAction = (
  querys: string[],
  options: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
) => {
  return async (dispatch: any): Promise<void> => {
    const poiUserId = options.poiUserId
    const savingId = options.savingId
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    const timePrefix: string = new Date()
      .getTime()
      .toString()
      .padStart(20, "0")
    // Order matters, can't await all in parallel
    for (let i = 0; i < querys.length; i++) {
      const query = querys[i]
      const orderPrefix = i.toString().padStart(5, "0")
      const words = await queryWords(query, dictionarys, { wordKeys })
      const addedWordKeys: string[] = await Promise.all(
        Object.entries(words)
          .map(async ([wordKey, word]) => {
            const wordRecord = await GoiWordRecord(
              poiUserId,
              savingId,
              wordKey
            ).ReadOrCreate()
            if (
              wordRecord.Level > 0 ||
              wordRecord.Prioritized ||
              wordRecord.Pending
            ) {
              console.debug(
                "Already added word to pendings: ",
                wordRecord.WordKey
              )
              return ""
            }
            await GoiWordRecord(poiUserId, savingId, wordKey).SetPending(
              `${timePrefix}-${orderPrefix}-${wordKey}`
            )
            return wordKey
          })
          .filter(wordKey => wordKey)
      )
      await GoiSaving(poiUserId, savingId).AttachRecords(addedWordKeys)
    }
  }
}

export const AddWordsFromWordAdderStateAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any, getState: any) => {
    const state = getState()
    const querys = getPendingQuerysFromState(state)
    return dispatch(AddWordsAction(querys, { poiUserId, savingId }))
  }
}

export const ClearPendingWordsAction = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return async (dispatch: any): Promise<void> => {
    console.debug("Clearing pending words... ")
    const wordRecords = await GoiSaving(poiUserId, savingId).GetRecords()
    console.debug("records", wordRecords)
    const wordKeys = wordRecords
      .filter(
        wordRecord =>
          wordRecord.Level === 0 &&
          !wordRecord.Prioritized &&
          wordRecord.Pending
      )
      .map(wordRecord => wordRecord.WordKey)
    await GoiSaving(poiUserId, savingId).ClearPendings(wordKeys)
    dispatch(RefreshWordAdderFromStateAction(poiUserId, savingId))
  }
}
