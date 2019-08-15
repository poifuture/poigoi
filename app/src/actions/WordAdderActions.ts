import {
  WordAdderStateType,
  WordAdderPendingQueryType,
  WordAdderSuggestionQueryType,
  WordAdderQueryType,
  WordFilterType,
} from "../states/WordAdderState"
import {
  GoiDictionarys,
  BulkGetAllDictionaryWords,
} from "../models/GoiDictionary"
import Immutable from "immutable"
import {
  GoiWordType,
  JA_POS,
  GoiJaWordType,
  JA_PRIMARY_POS,
} from "../types/GoiDictionaryTypes"
import { I18nString } from "../types/PoiI18nTypes"
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
import DebugModule from "debug"
import { GoiDb } from "../utils/GoiDb"
import { query } from "../pages/mamechishiki"
const debug = DebugModule("PoiGoi:WordAdderActions")

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const UPDATE_STATUS = "WORD_ADDER_ACTIONS_UPDATE_STATUS"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"
export const PUSH_COUNT_QUERY = "WORD_ADDER_ACTIONS_PUSH_COUNT_QUERY"
export const UPDATE_SUBTOTAL = "WORD_ADDER_ACTIONS_UPDATE_SUBTOTAL"
export const UPDATE_FILTER = "WORD_ADDER_ACTIONS_UPDATE_FILTER"

export const BasicPos: JA_PRIMARY_POS[] = [
  "VERB", //動詞
  "ADJ", //形容詞
  "KEIYODOSHI", //形容動詞
  "NOUN", //名詞
  "PRON", //代名詞
  "RENTAISHI", //連体詞
  "ADV", //副詞
  "CONJ", //接続詞
  "INTERJ", //感動詞
  "JODOSHI", //助動詞
  "JOSHI", //助詞
]

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

const CountStatusAction = (
  {
    // metadata
    poiUserId,
    savingId,
  }: {
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  cache: {
    // cache
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
  } = {}
) => {
  return (async dispatch => {
    debug("Counting status... ")
    const wordRecords =
      typeof cache.wordRecords !== "undefined"
        ? cache.wordRecords
        : await BulkGetWordRecords({ poiUserId, savingId })
    debug("Records:", wordRecords)
    const wordRecordsArray = Object.values(wordRecords)
    const learnedCount = wordRecordsArray.filter(
      wordRecord => wordRecord.Level > 0
    ).length
    const prioritiedCount = wordRecordsArray.filter(
      wordRecord => !(wordRecord.Level > 0) && wordRecord.Prioritied
    ).length
    const pendingCount = wordRecordsArray.filter(
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
    querys,
    dictionaryNames,
    filter,
  }: {
    query?: string
    querys?: string[]
    dictionaryNames: string[]
    filter: WordFilterType
  },
  cache: {
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
): Promise<{ [key: string]: GoiWordType }> => {
  debug("Query words... ", query, querys)
  const querysArray =
    typeof querys !== "undefined"
      ? querys
      : typeof query !== "undefined"
      ? [query]
      : []
  const allDictionaryWords =
    typeof cache.allDictionaryWords !== "undefined"
      ? cache.allDictionaryWords
      : await BulkGetAllDictionaryWords({ dictionaryNames })
  const querysRegExp = querysArray.map(query => new RegExp(query, "i"))
  const acceptPos = Immutable.Set(filter.AcceptPos)
  const queriedDictionaryWords: { [key: string]: GoiWordType } = {}
  for (let wordKey in allDictionaryWords) {
    const dictionaryWord = allDictionaryWords[wordKey]
    // filter textbook
    const textbookMatches = dictionaryWord.textbook.filter(tag => {
      let isQueryMatched = false
      for (let queryRegExp of querysRegExp) {
        if (tag.match(queryRegExp)) {
          isQueryMatched = true
          break
        }
      }
      if (isQueryMatched) {
        if (tag.includes("EXT")) {
          return filter.AcceptExtra ? true : false
        }
        return true
      }
      return false
    })
    if (textbookMatches.length === 0) {
      continue
    }
    // filter pos
    if (!dictionaryWord.pos) {
      continue
    } else if (Array.isArray(dictionaryWord.pos)) {
      if (acceptPos.intersect(dictionaryWord.pos).isEmpty()) {
        continue
      }
    } else if (!acceptPos.includes(dictionaryWord.pos)) {
      continue
    }
    queriedDictionaryWords[wordKey] = dictionaryWord
  }
  debug("Query words done ", queriedDictionaryWords)
  return queriedDictionaryWords
}

const CountQueryAction = (
  {
    query,
    poiUserId,
    savingId,
    filter,
  }: {
    query: string
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
    filter: WordFilterType
  },
  cache: {
    // cache
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
) => {
  return (async dispatch => {
    debug("Counting Query... ", query)
    query = query.trim()
    const dictionaryNames = await GoiSaving(
      poiUserId,
      savingId
    ).GetDictionarys()
    const allDictionaryWords =
      typeof cache.allDictionaryWords !== "undefined"
        ? cache.allDictionaryWords
        : await BulkGetAllDictionaryWords({ dictionaryNames })
    const queriedWords = await queryWords(
      { query, dictionaryNames, filter },
      { allDictionaryWords }
    )
    const wordRecords =
      typeof cache.wordRecords !== "undefined"
        ? cache.wordRecords
        : await BulkGetWordRecords({ poiUserId, savingId })
    const queriedWordRecordsArray = Object.values(wordRecords).filter(
      wordRecord => typeof queriedWords[wordRecord.WordKey] !== "undefined"
    )
    const forgotCount = queriedWordRecordsArray.filter(
      wordRecord => wordRecord.Level < 0
    ).length
    const totalCount =
      Object.keys(queriedWords).length - (filter.AcceptForgot ? 0 : forgotCount)
    const learnedCount = queriedWordRecordsArray.filter(
      wordRecord => wordRecord.Level > 0
    ).length
    const addedCount = queriedWordRecordsArray.filter(
      wordRecord =>
        wordRecord.Level === 0 && (wordRecord.Prioritied || wordRecord.Pending)
    ).length
    const newCount = totalCount - learnedCount - addedCount
    debug("Qeury: ", query, " Total: ", totalCount, " Forgot: ", forgotCount)
    await dispatch(
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
  cache: {
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
) => {
  return (async (dispatch, getState): Promise<void> => {
    const poiUserId = getState().GoiUser.get("PoiUserId") as PoiUser.PoiUserId
    const savingId = getState().GoiSaving.get("SavingId") as GoiSavingId
    const wordRecords =
      typeof cache.wordRecords !== "undefined"
        ? cache.wordRecords
        : await BulkGetWordRecords({ poiUserId, savingId })
    await dispatch(CountStatusAction({ poiUserId, savingId }, { wordRecords }))
    const dictionaryNames = await GoiSaving(
      poiUserId,
      savingId
    ).GetDictionarys()
    const allDictionaryWords =
      typeof cache.allDictionaryWords !== "undefined"
        ? cache.allDictionaryWords
        : await BulkGetAllDictionaryWords({ dictionaryNames })
    const filter = getState()
      .WordAdder.get("Filter")
      .toJS() as WordFilterType
    await dispatch(
      CountSubtotalAction({
        querys: getPendingQuerysFromState({ state: getState() }),
        filter,
        poiUserId,
        savingId,
      })
    )
    const onScreenQuerys = Immutable.Set.of(
      ...getSuggestionQuerysFromState({ state: getState() }),
      ...getPendingQuerysFromState({ state: getState() })
    ).toArray()
    for (let i = 0; i < onScreenQuerys.length; i++) {
      await dispatch(
        CountQueryAction(
          { query: onScreenQuerys[i], filter, poiUserId, savingId },
          { wordRecords, allDictionaryWords }
        )
      )
    }
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}

export const ShowWordAdderAction = () => {
  return (async (dispatch): Promise<void> => {
    dispatch(DisplayWordAdderAction({ display: true }))
    await dispatch(RefreshWordAdderAction())
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

export const AddPendingQueryAction = ({
  query,
  display,
  filter,
  poiUserId,
  savingId,
}: {
  query: string
  display: I18nString
  filter: WordFilterType
  poiUserId: PoiUser.PoiUserId
  savingId: GoiSavingId
}) => {
  return (async (dispatch): Promise<void> => {
    await dispatch(PushPendingQueryAction({ display, query }))
    await dispatch(CountQueryAction({ query, filter, poiUserId, savingId }))
  }) as ThunkAction<Promise<void>, RootStateType, unknown, Action>
}
export const AddPendingQuerysAction = (
  {
    querys,
    filter,
    poiUserId,
    savingId,
  }: {
    querys: WordAdderQueryType[]
    filter: WordFilterType
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  cache: {
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
) => {
  return (async (dispatch): Promise<void> => {
    for (let i = 0; i < querys.length; i++) {
      dispatch(
        PushPendingQueryAction({
          display: querys[i].Display,
          query: querys[i].Query,
        })
      )
      dispatch(
        PushCountQueryAction({
          query: querys[i].Query,
          totalCount: -1,
          learnedCount: -1,
          addedCount: -1,
          newCount: -1,
        })
      )
    }
    const wordRecords =
      typeof cache.wordRecords !== "undefined"
        ? cache.wordRecords
        : await BulkGetWordRecords({ poiUserId, savingId })
    const dictionaryNames = await GoiSaving(
      poiUserId,
      savingId
    ).GetDictionarys()
    const allDictionaryWords =
      typeof cache.allDictionaryWords !== "undefined"
        ? cache.allDictionaryWords
        : await BulkGetAllDictionaryWords({ dictionaryNames })
    for (let i = 0; i < querys.length; i++) {
      await dispatch(
        CountQueryAction(
          { query: querys[i].Query, filter, poiUserId, savingId },
          { wordRecords, allDictionaryWords }
        )
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
    filter,
    poiUserId,
    savingId,
  }: {
    querys: string[]
    filter: WordFilterType
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  cache: {
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
) => {
  return (async (): Promise<void> => {
    const dictionaryNames = await GoiSaving(
      poiUserId,
      savingId
    ).GetDictionarys()
    const allDictionaryWords =
      typeof cache.allDictionaryWords !== "undefined"
        ? cache.allDictionaryWords
        : await BulkGetAllDictionaryWords({ dictionaryNames })
    const timePrefix: string = new Date()
      .getTime()
      .toString()
      .padStart(20, "0")
    // Order matters, can't await all in parallel
    const potentialPendings: { [key: string]: string } = {}
    for (let i = 0; i < querys.length; i++) {
      const query = querys[i]
      const orderPrefix = i.toString().padStart(5, "0")
      const queriedDictionaryWords = await queryWords(
        { query, filter, dictionaryNames: dictionaryNames },
        { allDictionaryWords }
      )
      for (let wordKey in queriedDictionaryWords) {
        if (typeof potentialPendings[wordKey] === "undefined") {
          potentialPendings[wordKey] = `${timePrefix}-${orderPrefix}-${wordKey}`
        }
      }
    }
    debug("Updating pendings... ", potentialPendings)
    const previousWordRecords = await BulkGetWordRecords(
      { poiUserId, savingId },
      { wordKeys: Object.keys(potentialPendings) }
    )
    const availableWordRecords = Object.values(previousWordRecords).filter(
      wordRecord => {
        if (!filter.AcceptForgot && wordRecord.Level < 0) {
          debug("Already forgot word: ", wordRecord.WordKey)
          return false
        }
        if (
          wordRecord.Level > 0 ||
          wordRecord.Prioritied ||
          wordRecord.Pending
        ) {
          debug("Already added word to pendings: ", wordRecord.WordKey)
          return false
        }
        return true
      }
    )
    const pendingUpdateWordRecords = Object.values(availableWordRecords).map(
      wordRecord => {
        wordRecord.Pending = potentialPendings[wordRecord.WordKey]
        return wordRecord
      }
    )
    const bulkUpdateResult = await GoiDb().bulkDocs(pendingUpdateWordRecords)
    debug("Pendings updated. ", bulkUpdateResult)
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
    debug("Clearing pending words... ")
    const wordRecords = Object.values(
      await BulkGetWordRecords({ poiUserId, savingId })
    )
    debug("records", wordRecords)
    const pendingUpdatedWordRecords = wordRecords
      .filter(
        wordRecord =>
          wordRecord.Level === 0 && !wordRecord.Prioritied && wordRecord.Pending
      )
      .map(wordRecord => {
        wordRecord.Pending = ""
        return wordRecord
      })
    await GoiDb().bulkDocs(pendingUpdatedWordRecords)
    await dispatch(RefreshWordAdderAction())
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
export const CountSubtotalAction = (
  {
    querys,
    filter,
    poiUserId,
    savingId,
  }: {
    querys: string[]
    filter: WordFilterType
    poiUserId: PoiUser.PoiUserId
    savingId: GoiSavingId
  },
  cache: {
    // cache
    readonly wordRecords?: { [key: string]: GoiWordRecordPouchType }
    readonly allDictionaryWords?: { [key: string]: GoiWordType }
  } = {}
) => {
  return (async (dispatch): Promise<void> => {
    debug("Counting subtotal...", querys, filter)
    const wordRecords =
      typeof cache.wordRecords !== "undefined"
        ? cache.wordRecords
        : await BulkGetWordRecords({ poiUserId, savingId })
    const dictionaryNames = await GoiSaving(
      poiUserId,
      savingId
    ).GetDictionarys()
    const allDictionaryWords =
      typeof cache.allDictionaryWords !== "undefined"
        ? cache.allDictionaryWords
        : await BulkGetAllDictionaryWords({ dictionaryNames })
    const queriedWords = await queryWords(
      { querys, dictionaryNames, filter },
      { allDictionaryWords }
    )
    const queriedWordRecordsArray = Object.values(wordRecords).filter(
      wordRecord => typeof queriedWords[wordRecord.WordKey] !== "undefined"
    )
    const forgotCount = queriedWordRecordsArray.filter(
      wordRecord => wordRecord.Level < 0
    ).length
    const totalCount =
      Object.keys(queriedWords).length - (filter.AcceptForgot ? 0 : forgotCount)
    const learnedCount = queriedWordRecordsArray.filter(
      wordRecord => wordRecord.Level > 0
    ).length
    const addedCount = queriedWordRecordsArray.filter(
      wordRecord =>
        wordRecord.Level === 0 && (wordRecord.Prioritied || wordRecord.Pending)
    ).length
    const newCount = totalCount - learnedCount - addedCount
    debug("Qeury: ", querys, " Total: ", totalCount, " Forgot: ", forgotCount)
    await dispatch(UpdateSubtotalAction({ subtotal: newCount }))
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

export const ChangeFilterAction = ({
  acceptBasic,
  acceptPosFlags,
  acceptExtra,
  acceptForgot,
}: {
  acceptBasic?: boolean
  acceptPosFlags?: {
    [pos: string]: boolean
  }
  acceptExtra?: boolean
  acceptForgot?: boolean
}) => {
  return (async (dispatch, getState): Promise<void> => {
    debug("Changing filter...", acceptBasic, acceptPosFlags)
    const acceptPosChanged =
      typeof acceptBasic !== "undefined" ||
      typeof acceptPosFlags !== "undefined"
    const acceptPos: string[] = []
    if (acceptPosChanged) {
      const filter = getState()
        .WordAdder.get("Filter")
        .toJS() as WordFilterType
      const originalBasicFlags: { [pos: string]: boolean } = {}
      const allBasicFlagsOn: { [pos: string]: boolean } = {}
      const allBasicFlagsOff: { [pos: string]: boolean } = {}
      BasicPos.map(pos => {
        originalBasicFlags[pos] = filter.AcceptPos.includes(pos)
        allBasicFlagsOn[pos] = true
        allBasicFlagsOff[pos] = false
      })
      const fullPosFlags: { [pos: string]: boolean } = {
        ...originalBasicFlags,
        PROPER: filter.AcceptPos.includes("PROPER"),
        IDIOM: filter.AcceptPos.includes("IDIOM"),
        ...(typeof acceptPosFlags !== "undefined" && acceptPosFlags),
        ...(typeof acceptBasic !== "undefined" &&
          (acceptBasic ? allBasicFlagsOn : allBasicFlagsOff)),
      }
      debug("Full pos flags...", fullPosFlags)
      for (let pos in fullPosFlags) {
        if (fullPosFlags[pos]) {
          acceptPos.push(pos)
        }
      }
      acceptPos.push("KANA", "ROMAJI")
    }
    await dispatch(
      UpdateFilterAction({
        filter: {
          ...(acceptPosChanged && { AcceptPos: acceptPos }),
          ...(typeof acceptExtra !== "undefined" && {
            AcceptExtra: acceptExtra,
          }),
          ...(typeof acceptForgot !== "undefined" && {
            AcceptForgot: acceptForgot,
          }),
        },
      })
    )
    await dispatch(RefreshWordAdderAction())
  }) as ThunkAction<Promise<void>, RootStateType, void, Action>
}
