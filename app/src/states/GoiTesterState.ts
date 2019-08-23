import Immutable from "immutable"
import { TreeMultiSet } from "tstl"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import { GoiJudgeResult } from "../types/GoiTypes"

export interface GoiTesterStateType {
  IsTyping: boolean
  CurrentWord: GoiWordType
  Record: GoiWordRecordDataType | null
  JudgeResult: GoiJudgeResult
  ForcedWordKey: string
  LearnedCandidates: TreeMultiSet<GoiWordRecordDataType>
  PrioritiedCandidates: TreeMultiSet<GoiWordRecordDataType>
  PendingCandidates: TreeMultiSet<GoiWordRecordDataType>
}

export interface GoiTesterStateReducedType extends Immutable.Map<string, any> {}
