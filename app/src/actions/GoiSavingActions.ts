import { GoiSavingStateType } from "../states/GoiSavingState"
import { GoiUser, GoiUserDbKey } from "../models/GoiUser"
import { GoiSaving, GoiSavingDbKey } from "../models/GoiSaving"

export const UPDATE_GOI_SAVING_STATE =
  "GOI_SAVING_ACTIONS_UPDATE_GOI_SAVING_STATE"

export interface UpdateGoiSavingStateActionType
  extends Partial<GoiSavingStateType> {
  type: typeof UPDATE_GOI_SAVING_STATE
  SavingDbKey: GoiSavingDbKey
}

export type GoiSavingActionsType = UpdateGoiSavingStateActionType

const UpdateGoiSavingStateAction = (state: {
  SavingDbKey: GoiSavingDbKey
  Saving?: any
}): UpdateGoiSavingStateActionType => {
  return {
    type: UPDATE_GOI_SAVING_STATE,
    ...state,
  }
}

export const LazyInitSavingAction = (userDbKey: GoiUserDbKey) => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    console.debug("LazyInitSaving state: ", state)
    const savingDbKey = await GoiUser(userDbKey).getDefaultSaving()
    const saving = await GoiSaving(savingDbKey).read()
    dispatch(
      UpdateGoiSavingStateAction({
        SavingDbKey: savingDbKey,
        Saving: saving,
      })
    )
  }
}
