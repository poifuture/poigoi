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
import { GoiSavingId } from "../types/GoiTypes"

export type GoiUserDbKey = GlobalDbKey & { readonly brand: "GoiUserDbKey" }

export interface LocalGoiUsersDataType extends PoiLocalDataType {
  // PoiGlobalDbKey: Local/GoiUsers
  // Schema: Poi/Goi/Local/GoiUsers/v1
  readonly DbSchema: "Poi/Goi/Local/GoiUsers/v1"
  Users: PoiUser.PoiUserId[]
}

interface GoiUserDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Entry
  // Schema: Poi/Goi/PoiUser/Entry/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Entry/v1"
  readonly PoiUserId: PoiUser.PoiUserId
  GoiUserProfileDbKey: GlobalDbKey
  GoiUserSettingsDbKey: GlobalDbKey
  GoiUserSavingsIds: GoiSavingId[]
}
const DefaultGoiUser: Partial<GoiUserDataType> = {
  // Defaulter is mainly used for reading legacy schema
  DbSchema: "Poi/Goi/PoiUser/Entry/v1",
  GoiUserProfileDbKey: "" as GlobalDbKey,
  GoiUserSettingsDbKey: "" as GlobalDbKey,
  GoiUserSavingsIds: [],
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
      ...DefaultGoiUser,
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      GoiUserProfileDbKey: "" as GlobalDbKey,
      GoiUserSettingsDbKey: "" as GlobalDbKey,
      GoiUserSavingsIds: [],
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
  read = async (): Promise<
    GoiUserDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
  > => {
    const data = await GoiDb().get<GoiUserDataType>(this.dbKey)
    return { ...DefaultGoiUser, ...data }
  }
  private update = async (partial: Partial<GoiUserDataType>) => {
    console.debug("Updating GoiUser: ", partial)
    const data = await this.read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  getDefaultSaving = async (): Promise<GoiSavingId> => {
    const peekData = await this.read()
    if (peekData.GoiUserSavingsIds.length === 0) {
      const newSavingId = GoiSavingModel.GenerateId()
      await GoiSavingModel.Create(peekData.PoiUserId, newSavingId)
      await this.update({ GoiUserSavingsIds: [newSavingId] })
    }
    const data = await this.read()
    return data.GoiUserSavingsIds[0]
  }
}

export const GoiUser = (userDbKey: GoiUserDbKey) => {
  return new GoiUserModel(userDbKey)
}
