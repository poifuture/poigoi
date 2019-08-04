import { LocalDbKey } from "../utils/PoiDb"
import * as PoiUser from "../utils/PoiUser"
import { LocalGoiUsersDataType, GoiUser } from "../models/GoiUser"
import { GoiUserStateType, GoiUserDomainType } from "../states/GoiUserState"
import { GoiDb } from "../utils/GoiDb"
import { ThunkDispatch, ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { RootStateType } from "../states/RootState"

export const UPDATE_GOI_USER_STATE = "GOI_USER_ACTIONS_UPDATE_GOI_USER_STATE"

export interface UpdateGoiUserStateActionType
  extends Partial<GoiUserStateType> {
  type: typeof UPDATE_GOI_USER_STATE
  PoiUserId: PoiUser.PoiUserId
}

export type GoiUserActionsType = UpdateGoiUserStateActionType

const UpdateGoiUserStateAction = ({
  poiUserId,
  domain,
}: {
  poiUserId: PoiUser.PoiUserId
  domain?: GoiUserDomainType
}): UpdateGoiUserStateActionType => {
  return {
    type: UPDATE_GOI_USER_STATE,
    PoiUserId: poiUserId,
  }
}

const lazyInitLocalUsersEntry = async () => {
  // TODO: move to models
  const localGoiUsers = await GoiDb().GetOrNull<LocalGoiUsersDataType>(
    "_local/GoiUsers" as LocalDbKey
  )
  if (!localGoiUsers) {
    await GoiDb().put<LocalGoiUsersDataType>({
      _id: "_local/GoiUsers",
      DbKey: "_local/GoiUsers" as LocalDbKey,
      DbSchema: "Poi/Goi/Local/GoiUsers/v1",
      Users: [],
    })
  }
}

const lazyInitPoiUser = async (): Promise<PoiUser.PoiUserId> => {
  await lazyInitLocalUsersEntry()
  const localGoiUsers = await GoiDb().Get<LocalGoiUsersDataType>(
    "_local/GoiUsers" as LocalDbKey
  )
  if (localGoiUsers.Users && localGoiUsers.Users.length > 0) {
    return localGoiUsers.Users[0]
  }
  const poiUserId: PoiUser.PoiUserId = await PoiUser.GenerateId()
  await GoiDb().put<LocalGoiUsersDataType>({
    ...localGoiUsers,
    Users: localGoiUsers.Users.concat([poiUserId]),
  })
  return poiUserId
}

const lazyInitGoiUser = async ({
  poiUserId,
}: {
  poiUserId: PoiUser.PoiUserId
}) => {
  return await GoiUser(poiUserId).ReadOrCreate()
}

export const LazyInitUserAction = ({
  readState,
}: { readState?: boolean } = {}): ThunkAction<
  Promise<PoiUser.PoiUserId>,
  RootStateType,
  void,
  Action
> => {
  readState = typeof readState !== "undefined" ? readState : true
  return async (dispatch, getState) => {
    if (readState) {
      const state = getState()
      console.debug("LazyInitUser state: ", state)
      const poiUserId = state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId
      if (poiUserId) {
        console.debug("Already loaded PoiUser: ", poiUserId)
        return poiUserId
      }
    }
    const poiUserId = await lazyInitPoiUser()
    await lazyInitGoiUser({ poiUserId })
    dispatch(UpdateGoiUserStateAction({ poiUserId }))
    return poiUserId
  }
}
