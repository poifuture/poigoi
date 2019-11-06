import { LocalDbKey } from "../utils/PoiDb"
import * as PoiUser from "../utils/PoiUser"
import {
  LocalGoiUsersDataType,
  GoiUser,
  LocalPouchDBPasswordDataType,
} from "../models/GoiUser"
import { GoiUserStateType, GoiUserDomainType } from "../states/GoiUserState"
import { GoiDb, RemoteLogIn, RemoteGoiApiAddress } from "../utils/GoiDb"
import { ThunkDispatch, ThunkAction } from "redux-thunk"
import { Action } from "redux"
import QueryString from "query-string"
import { RootStateType } from "../states/RootState"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:GoiUserActions")

export const UPDATE_GOI_USER_STATE = "GOI_USER_ACTIONS_UPDATE_GOI_USER_STATE"

export interface UpdateGoiUserStateActionType
  extends Partial<GoiUserStateType> {
  type: typeof UPDATE_GOI_USER_STATE
  PoiUserId: PoiUser.PoiUserId
  PouchDbPassword?: string
}

export type GoiUserActionsType = UpdateGoiUserStateActionType

const UpdateGoiUserStateAction = ({
  poiUserId,
  pouchDbPassword,
  domain,
}: {
  poiUserId: PoiUser.PoiUserId
  pouchDbPassword?: string
  domain?: GoiUserDomainType
}): UpdateGoiUserStateActionType => {
  return {
    type: UPDATE_GOI_USER_STATE,
    PoiUserId: poiUserId,
    PouchDbPassword: pouchDbPassword,
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

const lazyRemoteLogin = async ({
  poiUserId,
}: {
  poiUserId: PoiUser.PoiUserId
}) => {
  const localPassword = await GoiDb().GetOrNull<LocalPouchDBPasswordDataType>(
    `_local/GoiUsers/${poiUserId}/Password` as LocalDbKey
  )
  let pouchDbPassword = localPassword ? localPassword.PouchDBPassword : ""
  if (!pouchDbPassword) {
    try {
      const response = await fetch(`http://${RemoteGoiApiAddress}/users`, {
        method: "POST",
        body: `PoiUserId=${poiUserId}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      const responseJson = await response.json()
      if (responseJson.PouchDBPassword) {
        pouchDbPassword = responseJson.PouchDBPassword as string
        await GoiDb().put<LocalPouchDBPasswordDataType>({
          ...(localPassword || {}),
          _id: `_local/GoiUsers/${poiUserId}/Password`,
          DbKey: `_local/GoiUsers/${poiUserId}/Password` as LocalDbKey,
          DbSchema: "Poi/Goi/Local/GoiUsers/Password/v1",
          PouchDBPassword: pouchDbPassword,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  RemoteLogIn(`poiuser-${poiUserId}`, pouchDbPassword)
  return pouchDbPassword
}

const importRemoteUser = async () => {
  if (window && window.location.search) {
    const query = QueryString.parse(window.location.search)
    if (query.action === "newsync" && query.token) {
      debug("Syncing %s", query.token)
      const token = Array.isArray(query.token)
        ? query.token[0]
        : query.token || ""
      const splitToken = token.split(":")
      if (splitToken.length < 2) {
        throw new Error("Invalid sync token")
      }
      const poiUserId = splitToken[0] as PoiUser.PoiUserId
      const pouchDbPassword = splitToken[1]

      const localGoiUsers = await GoiDb().Get<LocalGoiUsersDataType>(
        "_local/GoiUsers" as LocalDbKey
      )
      const otherPoiUserIds = localGoiUsers.Users.filter(v => v != poiUserId)
      await GoiDb().put<LocalGoiUsersDataType>({
        ...localGoiUsers,
        Users: [poiUserId, ...otherPoiUserIds],
      })
      const localPassword = await GoiDb().GetOrNull<
        LocalPouchDBPasswordDataType
      >(`_local/GoiUsers/${poiUserId}/Password` as LocalDbKey)
      await GoiDb().put<LocalPouchDBPasswordDataType>({
        ...(localPassword || {}),
        _id: `_local/GoiUsers/${poiUserId}/Password`,
        DbKey: `_local/GoiUsers/${poiUserId}/Password` as LocalDbKey,
        DbSchema: "Poi/Goi/Local/GoiUsers/Password/v1",
        PouchDBPassword: pouchDbPassword,
      })
      window.location.replace(window.location.origin)
    }
  }
}

export const LazyInitUserAction = ({
  readState,
}: { readState?: boolean } = {}) => {
  readState = typeof readState !== "undefined" ? readState : true
  return (async (dispatch, getState) => {
    await lazyInitLocalUsersEntry()
    await importRemoteUser()
    if (readState) {
      const state = getState()
      debug("LazyInitUser state: ", state)
      const poiUserId = state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId
      if (poiUserId) {
        debug("Already loaded PoiUser: ", poiUserId)
        return poiUserId
      }
    }
    const poiUserId = await lazyInitPoiUser()
    await lazyInitGoiUser({ poiUserId })
    const pouchDbPassword = await lazyRemoteLogin({ poiUserId })
    dispatch(UpdateGoiUserStateAction({ poiUserId, pouchDbPassword }))
    return poiUserId
  }) as ThunkAction<Promise<PoiUser.PoiUserId>, RootStateType, void, Action>
}

export const TestingInitUserAction = ({
  poiUserId,
}: {
  poiUserId: PoiUser.PoiUserId
}) => {
  return (async dispatch => {
    dispatch(UpdateGoiUserStateAction({ poiUserId }))
    return poiUserId
  }) as ThunkAction<Promise<PoiUser.PoiUserId>, RootStateType, void, Action>
}
