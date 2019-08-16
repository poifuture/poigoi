import Immutable from "immutable"

export type NewWordsOrderType = "User" | "Ordered" | "Shuffle"
export type RevisitStrategyType = "User" | "RevisitFirst" | "NoRevisit"
export interface GoiSettingsStateType {
  NewWordsOrder: NewWordsOrderType
  RevisitStrategy: RevisitStrategyType
}

export interface GoiSettingsStateReducedType
  extends Immutable.Map<string, any> {}
