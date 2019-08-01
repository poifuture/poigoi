import { GoiWordType } from "../types/GoiDictionaryTypes"
import { GoiWordRecordDataType } from "../models/GoiSaving"

export interface GoiTesterStateType {
  CurrentWord: GoiWordType
  LearnedCandidates: GoiWordRecordDataType[]
  PrioritiedCandidates: GoiWordRecordDataType[]
  PendingCandidates: GoiWordRecordDataType[]
}
