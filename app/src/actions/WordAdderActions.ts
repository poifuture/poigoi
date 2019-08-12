import {
  WordAdderStateType,
  WordAdderPendingQueryType,
  WordAdderSuggestionQueryType,
  WordAdderQueryType,
  WordFilterType,
} from "../states/WordAdderState"
import { GoiDictionarys } from "../models/GoiDictionary"
import Immutable from "immutable"
import {
  GoiWordType,
  I18nString,
  JA_POS,
  GoiJaWordType,
  JA_BASIC_POS,
} from "../types/GoiDictionaryTypes"
import * as PoiUser from "../utils/PoiUser"
import {
  GoiWordRecord,
  GoiWordRecordDataType,
  GoiSaving,
  GoiWordRecordPouchType,
  BulkGetWordRecords,
} from "../models/GoiSaving"
import { GoiSavingId, AllPromisesReceiver } from "../types/GoiTypes"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { Action, ActionCreator } from "redux"
import { RootStateType } from "../states/RootState"

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const UPDATE_STATUS = "WORD_ADDER_ACTIONS_UPDATE_STATUS"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"
export const PUSH_COUNT_QUERY = "WORD_ADDER_ACTIONS_PUSH_COUNT_QUERY"
export const UPDATE_SUBTOTAL = "WORD_ADDER_ACTIONS_UPDATE_SUBTOTAL"
export const UPDATE_FILTER = "WORD_ADDER_ACTIONS_UPDATE_FILTER"

export interface DisplayWordAdderActionType
  extends Action<typeof DISPLAY_WORD_ADDER> {
  Display: boolean
}

export interface UpdateStatusActionType extends Action<typeof UPDATE_STATUS> {
  LearnedCount: number
  PrioritiedCount: number
  PendingCount: number
}

export interface PushPendingQueryActionType
  extends Action<typeof PUSH_PENDING_QUERY> {
  Display: I18nString
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

export interface UpdateSubtotalActionType
  extends Action<typeof UPDATE_SUBTOTAL> {
  Subtotal: number
}

export interface UpdateFilterActionType extends Action<typeof UPDATE_FILTER> {
  Filter: Partial<WordFilterType>
}

export type WordAdderActionsType =
  | DisplayWordAdderActionType
  | UpdateStatusActionType
  | PushPendingQueryActionType
  | PopPendingQueryActionType
  | PushCountQueryActionType
  | UpdateSubtotalActionType
  | UpdateFilterActionType

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
  prioritiedCount,
  pendingCount,
}: {
  learnedCount: number
  prioritiedCount: number
  pendingCount: number
}): UpdateStatusActionType => {
  return {
    type: UPDATE_STATUS,
    LearnedCount: learnedCount,
    PrioritiedCount: prioritiedCount,
    PendingCount: pendingCount,
  }
}

const CountStatusAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}) => {
  return (async dispatch => {
    console.debug("Counting status... ")
    const wordRecords = Object.values(
      await BulkGetWordRecords({ poiUserId, savingId })
    )
    console.debug("Records:", wordRecords)
    const learnedCount = wordRecords.filter(wordRecord => wordRecord.Level > 0)
      .length
    const prioritiedCount = wordRecords.filter(
      wordRecord => !(wordRecord.Level > 0) && wordRecord.Prioritied
    ).length
    const pendingCount = wordRecords.filter(
      wordRecord =>
        !(wordRecord.Level > 0) && !wordRecord.Prioritied && wordRecord.Pending
    ).length
    dispatch(
      UpdateStatusAction({ learnedCount, prioritiedCount, pendingCount })
    )
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
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
  const queryRegExp = new RegExp(query, "i")

  const words: { [key: string]: GoiWordType } = {}
  const wordsPromises = wordKeys.map(async wordKey => {
    const word = await GoiDictionarys(dictionarys).GetWordOrNull(wordKey)
    if (!word) {
      return null
    }
    const matches = word.textbook.filter(tag => tag.match(queryRegExp))
    if (matches.length === 0) {
      return null
    }
    words[wordKey] = word
  })
  await Promise.all(wordsPromises.toArray())
  console.debug("Query words done ", query)
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
) => {
  return (async dispatch => {
    console.debug("Counting Query... ", query)
    query = query.trim()
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const words = await queryWords({ query, dictionarys }, { wordKeys })
    const wordRecords = Object.values(
      await BulkGetWordRecords(
        { poiUserId, savingId },
        { wordKeys: Object.keys(words) }
      )
    )
    const totalCount = Object.keys(words).length
    const learnedCount = wordRecords.filter(wordRecord => wordRecord.Level > 0)
      .length
    const addedCount = wordRecords.filter(
      wordRecord =>
        !(wordRecord.Level > 0) && (wordRecord.Prioritied || wordRecord.Pending)
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
  }) as ThunkAction<Promise<unknown>, RootStateType, unknown, Action<unknown>>
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
) => {
  return (async (dispatch, getState): Promise<void> => {
    readState = typeof readState !== "undefined" ? readState : false
    await dispatch(CountStatusAction({ poiUserId, savingId }))
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    const state = getState()
    const onScreenQuerys = Immutable.Set.of(
      ...querys,
      ...(readState ? getSuggestionQuerysFromState({ state }) : []),
      ...(readState ? getPendingQuerysFromState({ state }) : [])
    ).toArray()
    for (let i = 0; i < onScreenQuerys.length; i++) {
      await dispatch(
        CountQueryAction(
          { query: onScreenQuerys[i] },
          { poiUserId, savingId },
          { wordKeys }
        )
      )
    }
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

export const ShowWordAdderAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}): ThunkAction<void, RootStateType, void, Action> => {
  return (async (dispatch): Promise<void> => {
    dispatch(DisplayWordAdderAction({ display: true }))
    await dispatch(
      RefreshWordAdderAction(
        { querys: [] },
        { poiUserId, savingId },
        { readState: true }
      )
    )
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

const PushPendingQueryAction = ({
  display,
  query,
}: {
  display: I18nString
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
    display: I18nString
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
) => {
  return (async (dispatch): Promise<void> => {
    dispatch(PushPendingQueryAction({ display, query }))
    await dispatch(CountQueryAction({ query }, { poiUserId, savingId }))
  }) as ThunkAction<Promise<void>, RootStateType, unknown, Action>
}
export const AddPendingQuerysAction = (
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
) => {
  return (async (dispatch): Promise<void> => {
    for (let i = 0; i < querys.length; i++) {
      dispatch(
        PushPendingQueryAction({
          display: querys[i].Display,
          query: querys[i].Query,
        })
      )
    }
    for (let i = 0; i < querys.length; i++) {
      await dispatch(
        CountQueryAction({ query: querys[i].Query }, { poiUserId, savingId })
      )
    }
  }) as ThunkAction<Promise<void>, RootStateType, unknown, Action>
}

export const RemovePendingQueryAction = ({ query }: { query: string }) => {
  return (async (dispatch): Promise<void> => {
    dispatch(PopPendingQueryAction({ query }))
  }) as ThunkAction<Promise<void>, RootStateType, unknown, Action>
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
) => {
  return (async (): Promise<void> => {
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
            wordRecord.Prioritied ||
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
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

export const ClearPendingWordsAction = ({
  poiUserId,
  savingId,
}: {
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}) => {
  return (async (dispatch): Promise<void> => {
    console.debug("Clearing pending words... ")
    const wordRecords = Object.values(
      await BulkGetWordRecords({ poiUserId, savingId })
    )
    console.debug("records", wordRecords)
    const wordKeys = wordRecords
      .filter(
        wordRecord =>
          wordRecord.Level === 0 && !wordRecord.Prioritied && wordRecord.Pending
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
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

const UpdateSubtotalAction = ({
  subtotal,
}: {
  subtotal: number
}): UpdateSubtotalActionType => {
  return {
    type: UPDATE_SUBTOTAL,
    Subtotal: subtotal,
  }
}
export const passFilter = ({
  word,
  filter,
}: {
  word: GoiWordType
  filter: WordFilterType
}) => {
  if (!filter.AcceptExtra) {
    if (
      word.textbook.filter(textbook => !textbook.toLowerCase().includes("ext"))
        .length === 0
    ) {
      return false
    }
  }
  if (word.language.startsWith("ja")) {
    const jaWord = word as GoiJaWordType
    if (Array.isArray(jaWord.pos)) {
      for (let pos of jaWord.pos) {
        if (filter.AcceptPos.includes(pos)) {
          return true
        }
      }
    } else {
      if (filter.AcceptPos.includes(jaWord.pos)) {
        return true
      }
    }
  }
  return true
}
export const RefreshSubtotalAction = (
  {
    querys,
    filter,
  }: {
    querys: string[]
    filter: WordFilterType
  },
  {
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  }
) => {
  return (async (dispatch): Promise<void> => {
    const dictionarys = await GoiSaving(poiUserId, savingId).GetDictionarys()
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    // Order matters, can't await all in parallel
    const querysRegexs = querys.map(query => new RegExp(query))
    const queryedWordKeys = (await Promise.all(
      wordKeys.map(async wordKey => {
        const word = await GoiDictionarys(dictionarys).GetWordOrNull(wordKey)
        if (!word) {
          return null
        }
        if (!passFilter({ word, filter })) {
          return null
        }
        for (let queryRegex of querysRegexs) {
          for (let textbook of word.textbook) {
            if (textbook.match(queryRegex)) {
              return wordKey
            }
          }
        }
        return null
      })
    )).filter((wordKey): wordKey is string => !!wordKey)
    const wordRecords = await BulkGetWordRecords(
      { poiUserId, savingId },
      { wordKeys: queryedWordKeys }
    )
    const subtotal = Object.values(wordRecords).filter(wordRecord =>
      filter.AcceptForgot
        ? wordRecord.Level <= 0 && !wordRecord.Prioritied && !wordRecord.Pending
        : wordRecord.Level === 0 &&
          !wordRecord.Prioritied &&
          !wordRecord.Pending
    ).length
    dispatch(UpdateSubtotalAction({ subtotal }))
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

export const UpdateFilterAction = ({
  filter,
}: {
  filter: Partial<WordFilterType>
}): UpdateFilterActionType => {
  return {
    type: UPDATE_FILTER,
    Filter: filter,
  }
}
