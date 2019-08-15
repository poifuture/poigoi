import Immutable from "immutable"
import { JA_PRIMARY_POS } from "../types/GoiDictionaryTypes"
import { I18nString } from "../types/PoiI18nTypes"

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
export interface WordFilterType {
  AcceptPos: string[]
  AcceptExtra: boolean
  AcceptForgot: boolean
}
export interface JaWordFilterType extends WordFilterType {
  AcceptPos: JA_PRIMARY_POS[]
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
  Filter: WordFilterType
  Subtotal: number
}

export interface WordAdderStateReducedType extends Immutable.Map<string, any> {}
