import { WordAdderStateType } from "../states/WordAdderState"
import { GoiDictionarys } from "../models/GoiDictionary"
import Immutable from "immutable"
import { GoiWordType } from "../types/GoiDictionaryTypes"

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"
export const PUSH_COUNT_QUERY = "WORD_ADDER_ACTIONS_PUSH_COUNT_QUERY"

export interface DisplayWordAdderActionType {
  type: typeof DISPLAY_WORD_ADDER
  Display: boolean
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
export const PushCountQueryAction = (
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

const CountQueryAction = (
  query: string,
  dictionarys: string[],
  options?: { wordKeys?: Immutable.Set<string> }
) => {
  // TODO: countQuery
  const fullOptions = {
    wordKeys: null,
    ...options,
  }
  return async (dispatch: any): Promise<void> => {
    console.debug("Counting Query... ", query)
    const wordKeys = fullOptions.wordKeys
      ? fullOptions.wordKeys
      : await GoiDictionarys(dictionarys).GetAllWordsKeys()
    console.debug("AllWordKeys", wordKeys)
    const queryRegExp = new RegExp(query)
    const words: GoiWordType[] = (await Promise.all(
      wordKeys.map(async wordKey => {
        const word = await GoiDictionarys(dictionarys).GetWordOrNull(wordKey)
        if (!word) {
          return null
        }
        const matches = word.textbook.filter(tag => tag.match(queryRegExp))
        if (matches.length === 0) {
          return null
        }
        return word
      })
    )).filter((word): word is GoiWordType => word !== null)
    dispatch(PushCountQueryAction(query, words.length, 0, 0, 0))
    console.error("TODO: Count Query")
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

export const ShowWordAdderAction = () => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const dictionarys = getDictionarys(state)
    const wordKeys = await GoiDictionarys(dictionarys).GetAllWordsKeys()
    state.WordAdder.get("Suggestions").map((suggestion: any) => {
      const query = suggestion.get("Query") as string
      dispatch(CountQueryAction(query, dictionarys, { wordKeys }))
    })
    dispatch(DisplayWordAdderAction())
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

export const AddPendingQueryAction = (display: string, query: string) => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const dictionarys = getDictionarys(state)
    dispatch(CountQueryAction(query, dictionarys))
    dispatch(PushPendingQueryAction(display, query))
  }
}

export const RemovePendingQueryAction = (query: string) => {
  return async (dispatch: any): Promise<void> => {
    dispatch(PopPendingQueryAction(query))
  }
}
