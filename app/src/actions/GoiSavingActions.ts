import { GoiSavingStateType } from "../states/GoiSavingState"
import { GoiUser, GoiUserModel } from "../models/GoiUser"
import { GoiSaving, GoiSavingModel } from "../models/GoiSaving"
import { GoiSavingId } from "../types/GoiTypes"
import * as PoiUser from "../utils/PoiUser"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { RootStateType } from "../states/RootState"

export const UPDATE_GOI_SAVING_STATE =
  "GOI_SAVING_ACTIONS_UPDATE_GOI_SAVING_STATE"

export interface UpdateGoiSavingStateActionType
  extends Action<typeof UPDATE_GOI_SAVING_STATE> {
  SavingId: GoiSavingId
  Saving?: any
}

export type GoiSavingActionsType = UpdateGoiSavingStateActionType

const UpdateGoiSavingStateAction = ({
  savingId,
  saving,
}: {
  savingId: GoiSavingId
  saving?: any
}): UpdateGoiSavingStateActionType => {
  return {
    type: UPDATE_GOI_SAVING_STATE,
    SavingId: savingId,
    Saving: saving,
  }
}

export const LazyInitSavingAction = ({
  poiUserId,
}: {
  poiUserId: PoiUser.PoiUserId
}): ThunkAction< Promise <GoiSavingId>, RootStateType, void, Action> => {
  return async (dispatch): Promise<GoiSavingId> => {
    const savingId = await GoiUser(poiUserId).getDefaultSaving()
    const saving = await GoiSaving(poiUserId, savingId).Read()
    dispatch(
      UpdateGoiSavingStateAction({
        savingId: savingId,
        saving: saving,
      })
    )
    return savingId
  }
}
