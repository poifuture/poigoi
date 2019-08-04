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
  GoiWordRecordDataType,
  GoiSaving,
} from "../models/GoiSaving"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { Action, ActionCreator } from "redux"
import { RootStateType } from "../states/RootState"

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const UPDATE_STATUS = "WORD_ADDER_ACTIONS_UPDATE_STATUS"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"
export const PUSH_COUNT_QUERY = "WORD_ADDER_ACTIONS_PUSH_COUNT_QUERY"

export interface DisplayWordAdderActionType
  extends Action<typeof DISPLAY_WORD_ADDER> {
  // type: typeof DISPLAY_WORD_ADDER
  Display: boolean
}

export interface UpdateStatusActionType extends Action<typeof UPDATE_STATUS> {
  LearnedCount: number
  PrioritizedCount: number
  PendingCount: number
}

export interface PushPendingQueryActionType
  extends Action<typeof PUSH_PENDING_QUERY> {
  Display: string
  Query: string
}
export interface PopPendingQueryActionType
  extends Action<typeof POP_PENDING_QUERY> {
  Query: string
}

export interface PushCountQueryActionType
  extends Action<typeof PUSH_COUNT_QUERY> {
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
  { display }: { display: boolean } = { display: true }
): DisplayWordAdderActionType => {
  return {
    type: DISPLAY_WORD_ADDER,
    Display: display,
  }
}

const UpdateStatusAction = ({
  learnedCount,
  prioritizedCount,
  pendingCount,
}: {
  learnedCount: number
  prioritizedCount: number
  pendingCount: number
}): UpdateStatusActionType => {
  return {
    type: UPDATE_STATUS,
    LearnedCount: learnedCount,
    PrioritizedCount: prioritizedCount,
    PendingCount: pendingCount,
  }
}

const CountStatusAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
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
    dispatch(
      UpdateStatusAction({ learnedCount, prioritizedCount, pendingCount })
    )
  }
}

const PushCountQueryAction = ({
  query,
  totalCount,
  learnedCount,
  addedCount,
  newCount,
}: {
  query: string
  totalCount: number
  learnedCount: number
  addedCount: number
  newCount: number
}): PushCountQueryActionType => {
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
  {
    query,
    dictionarys,
  }: {
    query: string
    dictionarys: string[]
  },
  { wordKeys }: { wordKeys?: Immutable.Set<string> } = {}
): Promise<{ [key: string]: GoiWordType }> => {
  console.debug("Query words... ", query)
  wordKeys =
    typeof wordKeys !== "undefined"
      ? wordKeys
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
  {
    query,
  }: {
    query: string
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  {
    wordKeys,
  }: {
    wordKeys?: Immutable.Set<string>
  } = {}
): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    console.debug("Counting Query... ", query)
    const words = await queryWords({ query, dictionarys }, { wordKeys })
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
      PushCountQueryAction({
        query,
        totalCount,
        learnedCount,
        addedCount,
        newCount,
      })
    )
  }
}

const getSuggestionQuerysFromState = ({
  state,
}: {
  state: RootStateType
}): string[] => {
  const suggestionQuerys = state.WordAdder.get(
    "Suggestions"
  ).toJS() as WordAdderSuggestionQueryType[]
  return suggestionQuerys.map(suggestion => suggestion.Query)
}
const getPendingQuerysFromState = ({
  state,
}: {
  state: RootStateType
}): string[] => {
  const pendingQuerys = state.WordAdder.get(
    "Pendings"
  ).toJS() as WordAdderPendingQueryType[]
  return pendingQuerys.map(pending => pending.Query)
}

export const RefreshWordAdderAction = (
  {
    querys,
  }: {
    querys: string[]
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  {
    readState,
  }: {
    readState?: boolean
  } = {}
): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch, getState): Promise<void> => {
    readState = typeof readState !== "undefined" ? readState : false
    dispatch(CountStatusAction({ poiUserId, savingId }))
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    const state = getState()
    Immutable.Set.of(
      ...querys,
      ...(readState ? getSuggestionQuerysFromState({ state }) : []),
      ...(readState ? getPendingQuerysFromState({ state }) : [])
    ).map(query =>
      dispatch(
        CountQueryAction({ query }, { poiUserId, savingId }, { wordKeys })
      )
    )
  }
}

export const ShowWordAdderAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
    dispatch(DisplayWordAdderAction({ display: true }))
    await dispatch(
      RefreshWordAdderAction(
        { querys: [] },
        { poiUserId, savingId },
        { readState: true }
      )
    )
  }
}

const PushPendingQueryAction = ({
  display,
  query,
}: {
  display: string
  query: string
}): PushPendingQueryActionType => {
  return {
    type: PUSH_PENDING_QUERY,
    Display: display,
    Query: query,
  }
}
const PopPendingQueryAction = ({
  query,
}: {
  query: string
}): PopPendingQueryActionType => {
  return {
    type: POP_PENDING_QUERY,
    Query: query,
  }
}

export const AddPendingQueryAction = (
  {
    query,
    display,
  }: {
    query: string
    display: string
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
    dispatch(CountQueryAction({ query }, { poiUserId, savingId }))
    dispatch(PushPendingQueryAction({ display, query }))
  }
}

export const RemovePendingQueryAction = ({
  query,
}: {
  query: string
}): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
    dispatch(PopPendingQueryAction({ query }))
  }
}

export const AddWordsFromQuerysAction = (
  {
    querys,
  }: {
    querys: string[]
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
): ThunkAction<void, RootStateType, void, Action> => {
  return async (): Promise<void> => {
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
      const words = await queryWords({ query, dictionarys }, { wordKeys })
      const addedWordKeys = await Promise.all(
        Object.entries(words).map(async ([wordKey, word]) => {
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
            return null
          }
          await GoiWordRecord(poiUserId, savingId, wordKey).SetPending(
            `${timePrefix}-${orderPrefix}-${wordKey}`
          )
          return wordKey
        })
      )
      const filteredWordKeys: string[] = addedWordKeys.filter(
        (wordKey): wordKey is string => (wordKey ? true : false)
      )
      await GoiSaving(poiUserId, savingId).AttachRecords(filteredWordKeys)
    }
  }
}

export const ClearPendingWordsAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}): ThunkAction<void, RootStateType, void, Action> => {
  return async (dispatch): Promise<void> => {
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
    await dispatch(
      RefreshWordAdderAction(
        { querys: [] },
        { poiUserId, savingId },
        { readState: true }
      )
    )
  }
}
