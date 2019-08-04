import Immutable from "immutable"
import { GoiSavingId } from "../types/GoiTypes"

export interface GoiSavingStateType {
  SavingId: GoiSavingId
  Saving: any
}

export interface GoiSavingStateReducedType extends Immutable.Map<string, any> {}
