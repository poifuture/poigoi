import { GoiSavingStateType } from "../states/GoiSavingState"
import { GoiUser, GoiUserModel } from "../models/GoiUser"
import { GoiSaving, GoiSavingModel } from "../models/GoiSaving"
import { GoiSavingId } from "../types/GoiTypes"
import * as PoiUser from "../utils/PoiUser"

export const UPDATE_GOI_SAVING_STATE =
  "GOI_SAVING_ACTIONS_UPDATE_GOI_SAVING_STATE"

export interface UpdateGoiSavingStateActionType
  extends Partial<GoiSavingStateType> {
  type: typeof UPDATE_GOI_SAVING_STATE
  SavingId: GoiSavingId
}

export type GoiSavingActionsType = UpdateGoiSavingStateActionType

const UpdateGoiSavingStateAction = (state: {
  SavingId: GoiSavingId
  Saving?: any
}): UpdateGoiSavingStateActionType => {
  return {
    type: UPDATE_GOI_SAVING_STATE,
    ...state,
  }
}

export const LazyInitSavingAction = (poiUserId: PoiUser.PoiUserId) => {
  return async (dispatch: any): Promise<GoiSavingId> => {
    const savingId = await GoiUser(poiUserId).getDefaultSaving()
    const saving = await GoiSaving(poiUserId, savingId).Read()
    dispatch(
      UpdateGoiSavingStateAction({
        SavingId: savingId,
        Saving: saving,
      })
    )
    return savingId
  }
}
