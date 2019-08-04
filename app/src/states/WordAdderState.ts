import Immutable from "immutable"

export interface WordAdderSuggestionQueryType {
  Display: string
  Query: string
}
export interface WordAdderPendingQueryType {
  Display: string
  Query: string
}
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
    PrioritizedCount: number
    PendingCount: number
  }
  Suggestions: WordAdderSuggestionQueryType[]
  Pendings: WordAdderPendingQueryType[]
  Counters: WordAdderQueryCountersType
}

export interface WordAdderStateReducedType extends Immutable.Map<string, any> {}
