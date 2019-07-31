export interface WordAdderSuggestionQueryType {
  Hint: string
  Query: string
}
export interface WordAdderPendingQueryType {
  Hint: string
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
