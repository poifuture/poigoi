import Immutable from "immutable"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import { GoiJudgeResult } from "../types/GoiTypes"
import Heap from "../algorithm/Heap"

export interface GoiTesterStateType {
  IsTyping: boolean
  CurrentWord: GoiWordType
  Record: GoiWordRecordDataType | null
  JudgeResult: GoiJudgeResult
  LearnedCandidates: Heap<GoiWordRecordDataType>
  PrioritiedCandidates: Heap<GoiWordRecordDataType>
  PendingCandidates: Heap<GoiWordRecordDataType>
}

export interface GoiTesterStateReducedType extends Immutable.Map<string, any> {}
