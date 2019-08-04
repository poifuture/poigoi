import uuid5 from "uuid/v5"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingModel, GoiSaving } from "./GoiSaving"
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
  Domain: "Local" | "Poi"
  GoiUserProfileDbKey: GlobalDbKey
  GoiUserSettingsDbKey: GlobalDbKey
  GoiUserSavingsIds: GoiSavingId[]
}
type GoiUserPouchType = GoiUserDataType &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta

export class GoiUserModel {
  public static GetDbKey = (poiUserId: PoiUser.PoiUserId): GoiUserDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Entry` as GoiUserDbKey
  }
  private readonly dbKey: GoiUserDbKey
  private readonly poiUserId: PoiUser.PoiUserId
  constructor(poiUserId: PoiUser.PoiUserId) {
    this.dbKey = GoiUserModel.GetDbKey(poiUserId)
    this.poiUserId = poiUserId
  }
  private DefaultData = (): GoiUserDataType => {
    return {
      DbKey: this.dbKey,
      DbUuid: uuid5(this.dbKey, GoiNS) as DbUuid,
      DbSchema: "Poi/Goi/PoiUser/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: this.poiUserId,
      Domain: "Local",
      GoiUserProfileDbKey: "" as GlobalDbKey,
      GoiUserSettingsDbKey: "" as GlobalDbKey,
      GoiUserSavingsIds: [],
    }
  }
  Exists = async (): Promise<boolean> => {
    return await GoiDb().Exists(this.dbKey)
  }
  Create = async (): Promise<GoiUserDbKey> => {
    console.debug("Creating GoiUser...", this.poiUserId)
    const newData: GoiUserDataType = this.DefaultData()
    await GoiDb().put({
      _id: this.dbKey,
      ...newData,
    })
    return this.dbKey
  }

  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  Read = async (): Promise<GoiUserPouchType> => {
    const data = await GoiDb().Get<GoiUserPouchType>(this.dbKey)
    return { ...this.DefaultData(), ...data }
  }
  private update = async (partial: Partial<GoiUserDataType>) => {
    console.debug("Updating GoiUser: ", partial)
    const data = await this.Read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  ReadOrCreate = async (): Promise<GoiUserPouchType> => {
    if (!(await this.Exists())) {
      await this.Create()
    }
    return await this.Read()
  }
  getDefaultSaving = async (): Promise<GoiSavingId> => {
    const data = await this.Read()
    if (data.GoiUserSavingsIds.length === 0) {
      const newSavingId = GoiSavingModel.GenerateId()
      await GoiSaving(this.poiUserId, newSavingId).Create()
      await this.update({ GoiUserSavingsIds: [newSavingId] })
      return newSavingId
    }
    return data.GoiUserSavingsIds[0]
  }
}

export const GoiUser = (poiUserId: PoiUser.PoiUserId) => {
  return new GoiUserModel(poiUserId)
}
