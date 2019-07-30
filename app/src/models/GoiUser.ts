import PouchDB from "pouchdb-browser"
import uuid5 from "uuid/v5"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingModel, GoiSavingDbKey } from "./GoiSaving"
import {
  DbUuid,
  GlobalDbKey,
  PoiGlobalDataType,
  PoiLocalDataType,
} from "../utils/PoiDb"

export type GoiUserDbKey = GlobalDbKey & { readonly brand: "GoiUserDbKey" }

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
  GoiUserSavingDbKey: GoiSavingDbKey[]
}

export class GoiUserModel {
  public static GetDbKey = (poiUserId: PoiUser.PoiUserId): GoiUserDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Entry` as GoiUserDbKey
  }
  public static Create = async (
    poiUserId: PoiUser.PoiUserId
  ): Promise<GoiUserDbKey> => {
    console.debug("Creating GoiUser from PoiUserId: ", poiUserId)
    const dbKey: GoiUserDbKey = GoiUserModel.GetDbKey(poiUserId) // `Poi/Goi/PoiUser/${poiUserId}/Entry`
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS) as DbUuid
    const newData: GoiUserDataType = {
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      GoiUserProfileDbKey: "" as GlobalDbKey,
      GoiUserSettingsDbKey: "" as GlobalDbKey,
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

  private dbKey: GoiUserDbKey
  constructor(dbKey: GoiUserDbKey) {
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
    console.debug("Updating GoiUser: ", partial)
    const data = await this.read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  getDefaultSaving = async (): Promise<GoiSavingDbKey> => {
    const peekData = await this.read()
    if (peekData.GoiUserSavingDbKey.length === 0) {
      const newSavingDbKey = await GoiSavingModel.Create(peekData.PoiUserId)
      await this.update({ GoiUserSavingDbKey: [newSavingDbKey] })
    }
    const data = await this.read()
    return data.GoiUserSavingDbKey[0]
  }
}

export const GoiUser = (userDbKey: GoiUserDbKey) => {
  return new GoiUserModel(userDbKey)
}
