import Immutable from "immutable"
import { I18nString } from "../types/GoiDictionaryTypes"

export interface WordAdderQueryType {
  Display: I18nString
  Query: string
}
export interface WordAdderSuggestionQueryType extends WordAdderQueryType {
  SubQuerys?: WordAdderQueryType[]
}
export interface WordAdderPendingQueryType extends WordAdderQueryType {}

export interface WordAdderQueryCounterType {
  TotalCount: number
  LearnedCount: number
  AddedCount: number
  NewCount: number
}
export type WordAdderQueryCountersType = {
  [query: string]: WordAdderQueryCounterType
}
export interface WordAdderStateType {
  Display: boolean
  Status: {
    LearnedCount: number
    PrioritiedCount: number
    PendingCount: number
  }
  Suggestions: WordAdderSuggestionQueryType[]
  Pendings: WordAdderPendingQueryType[]
  Counters: WordAdderQueryCountersType
}

export interface WordAdderStateReducedType extends Immutable.Map<string, any> {}
