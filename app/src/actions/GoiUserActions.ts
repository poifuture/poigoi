import { GlobalDbKey, LocalDbKey } from "../utils/PoiDb"
import * as PoiUser from "../utils/PoiUser"
import {
  GoiUser,
  GoiUserModel,
  LocalGoiUsersDataType,
  GoiUserDbKey,
} from "../models/GoiUser"
import { GoiUserStateType, GoiUserDomainType } from "../states/GoiUserState"
import { GoiDb } from "../utils/GoiDb"

export const UPDATE_GOI_USER_STATE = "UPDATE_GOI_USER_STATE"

export interface UpdateGoiUserStateActionType
  extends Partial<GoiUserStateType> {
  type: typeof UPDATE_GOI_USER_STATE
  PoiUserId: PoiUser.PoiUserId
}

export type GoiUserActionsType = UpdateGoiUserStateActionType

const UpdateGoiUserStateAction = (state: {
  PoiUserId: PoiUser.PoiUserId
  Domain?: GoiUserDomainType
  UserDbKey?: GoiUserDbKey
}): UpdateGoiUserStateActionType => {
  return {
    type: UPDATE_GOI_USER_STATE,
    ...state,
  }
}

const lazyInitLocalUsersEntry = async () => {
  // TODO: move to models
  const localGoiUsers = await GoiDb().getOrNull<LocalGoiUsersDataType>(
    "Local/GoiUsers" as LocalDbKey
  )
  if (!localGoiUsers) {
    await GoiDb().put<LocalGoiUsersDataType>({
      _id: "Local/GoiUsers",
      DbKey: "Local/GoiUsers" as LocalDbKey,
      DbSchema: "Poi/Goi/Local/GoiUsers/v1",
      Users: [],
    })
  }
}

const lazyInitPoiUser = async (): Promise<PoiUser.PoiUserId> => {
  await lazyInitLocalUsersEntry()
  const localGoiUsers = await GoiDb().get<LocalGoiUsersDataType>(
    "Local/GoiUsers"
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

const lazyInitGoiUser = async (
  poiUserId: PoiUser.PoiUserId
): Promise<GoiUserDbKey> => {
  const userDbKey = GoiUserModel.GetDbKey(poiUserId)
  if (await GoiDb().getOrNull(userDbKey)) {
    console.debug("Found UserDbKey: ", userDbKey)
    return userDbKey
  }
  const createdUserDbKey = await GoiUserModel.Create(poiUserId)
  return createdUserDbKey
}

export const LazyInitUserAction = (options?: { forceDatabase?: boolean }) => {
  const funcOptions = {
    forceDatabase: true,
    ...options,
  }
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    console.debug("LazyInitUser state: ", state)
    if (!funcOptions.forceDatabase) {
      if (state.GoiUser.get("poiUserId")) {
        console.debug("LazyInitUser state: ", state)
        return
      }
    }
    const poiUserId = await lazyInitPoiUser()
    const userDbKey = await lazyInitGoiUser(poiUserId)
    dispatch(
      UpdateGoiUserStateAction({
        PoiUserId: poiUserId,
        UserDbKey: userDbKey,
      })
    )
  }
}
