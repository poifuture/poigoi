import Immutable from "immutable"
import SortedArray from "collections/sorted-array"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import { GoiJudgeResult } from "../types/GoiTypes"

export interface GoiTesterStateType {
  IsTyping: boolean
  CurrentWord: GoiWordType
  Record: GoiWordRecordDataType | null
  JudgeResult: GoiJudgeResult
  ForcedWordKey: string
  LearnedCandidates: SortedArray<GoiWordRecordDataType>
  PrioritiedCandidates: SortedArray<GoiWordRecordDataType>
  PendingCandidates: SortedArray<GoiWordRecordDataType>
}

export interface GoiTesterStateReducedType extends Immutable.Map<string, any> {}
