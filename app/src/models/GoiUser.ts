import PouchDB from "pouchdb-browser"
import uuid5 from "uuid/v5"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingModel } from "./GoiSaving"
import {
  DbUuid,
  PoiGlobalDataType,
  GlobalDbKey,
  PoiLocalDataType,
} from "../utils/PoiDb"

export interface LocalGoiUsersDataType extends PoiLocalDataType {
  // PoiGlobalDbKey: Local/GoiUsers
  // Schema: Poi/Goi/Local/GoiUsers/v1
  DbSchema: "Poi/Goi/Local/GoiUsers/v1"
  Users: PoiUser.PoiUserId[]
}

interface GoiUserDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Entry
  // Schema: Poi/Goi/PoiUser/Entry/v1
  DbSchema: "Poi/Goi/PoiUser/Entry/v1"
  PoiUserId: PoiUser.PoiUserId
  GoiUserProfileDbKey: GlobalDbKey
  GoiUserSettingsDbKey: GlobalDbKey
  GoiUserSavingDbKey: GlobalDbKey[]
}

export class GoiUserModel {
  public static GetDbKey = (poiUserId: PoiUser.PoiUserId) => {
    return `Poi/Goi/PoiUser/${poiUserId}/Entry` as GlobalDbKey
  }
  public static Create = async (
    poiUserId: PoiUser.PoiUserId
  ): Promise<GlobalDbKey> => {
    const peekLocalGoiUsersDoc = await GoiDb().getOrNull<LocalGoiUsersDataType>(
      "Local/GoiUsers"
    )
    if (peekLocalGoiUsersDoc) {
      if (poiUserId in (peekLocalGoiUsersDoc as any).users) {
        throw new Error("User is already created locally.")
      }
    } else {
      await GoiDb().put<LocalGoiUsersDataType>({
        _id: "Local/GoiUsers",
        DbKey: "Local/GoiUsers",
        DbSchema: "Poi/Goi/Local/GoiUsers/v1",
        Users: [],
      })
    }
    const LocalGoiUsersDoc = await GoiDb().get<LocalGoiUsersDataType>(
      "Local/GoiUsers"
    )
    await GoiDb().put({
      ...LocalGoiUsersDoc,
      users: LocalGoiUsersDoc.Users.push(poiUserId),
    })
    //static builder
    const dbKey: GlobalDbKey = GoiUserModel.GetDbKey(poiUserId) // `Poi/Goi/PoiUser/${poiUserId}/Entry`
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS)
    const newData: GoiUserDataType = {
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      GoiUserProfileDbKey: "",
      GoiUserSettingsDbKey: "",
      GoiUserSavingDbKey: [],
    }
    await GoiDb().put({
      _id: dbKey,
      ...newData,
    })
    const newUser = new GoiUserModel(dbKey)
    newUser.sync()
    return dbKey
  }

  private dbKey: GlobalDbKey = ""
  constructor(dbKey: GlobalDbKey) {
    this.dbKey = dbKey
  }
  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  private read = async () => {
    return await GoiDb().get<GoiUserDataType>(this.dbKey)
  }
  private update = async (partial: Partial<GoiUserDataType>) => {
    const data = await this.read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  getDefaultSaving = async (): Promise<GlobalDbKey> => {
    const peekData = await this.read()
    if (peekData.GoiUserSavingDbKey.length === 0) {
      const newSavingDbKey = await GoiSavingModel.Create(peekData.PoiUserId)
      await this.update({ GoiUserSavingDbKey: [newSavingDbKey] })
    }
    const data = await this.read()
    return data.GoiUserSavingDbKey[0]
  }
}

export const GoiUser = (userDbKey: GlobalDbKey) => {
  return new GoiUserModel(userDbKey)
}
