import Immutable from "immutable"
import { GoiWordType } from "../types/GoiDictionaryTypes"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import { GoiJudgeResult } from "../types/GoiTypes"

export interface GoiTesterStateType {
  CurrentWord: GoiWordType
  JudgeResult: GoiJudgeResult
  LearnedCandidates: GoiWordRecordDataType[]
  PrioritiedCandidates: GoiWordRecordDataType[]
  PendingCandidates: GoiWordRecordDataType[]
}

export interface GoiTesterStateReducedType extends Immutable.Map<string, any> {}
