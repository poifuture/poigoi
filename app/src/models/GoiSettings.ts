import uuid5 from "uuid/v5"
import { DbUuid, PoiGlobalDataType, GlobalDbKey } from "../utils/PoiDb"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"
import { LanguageCode } from "../types/GoiDictionaryTypes"

export type GoiSettingsDbKey = GlobalDbKey & { readonly brand: "GoiUserDbKey" }

export interface GoiSettingsDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Settings
  // Schema: Poi/Goi/PoiUser/Settings/v1
  DbSchema: "Poi/Goi/PoiUser/Settings/v1"
  PoiUserId: PoiUser.PoiUserId
  autoSync: boolean
  locale: LanguageCode
}

export class GoiSettingsModel {
  public static GetDbKey = (poiUserId: PoiUser.PoiUserId): GoiSettingsDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Settings` as GoiSettingsDbKey
  }
  public static Create = async (
    poiUserId: PoiUser.PoiUserId
  ): Promise<GoiSettingsDbKey> => {
    //static builder
    const dbKey: GoiSettingsDbKey = GoiSettingsModel.GetDbKey(poiUserId) // `Poi/Goi/PoiUser/${poiUserId}/Settings`
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS) as DbUuid
    const newData: GoiSettingsDataType = {
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Settings/v1",

      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      autoSync: true,
      locale: "zh-c2",
    }
    await GoiDb().put({
      _id: dbKey,
      ...newData,
    })
    const newSettings = new GoiSettingsModel(dbKey)
    newSettings.sync()
    return dbKey
  }
  private dbKey: GoiSettingsDbKey
  constructor(dbKey: GoiSettingsDbKey) {
    this.dbKey = dbKey
  }
  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  private read = async () => {
    const data = await GoiDb().Get(this.dbKey)
    const typedData = data as (GoiSettingsDataType &
      PouchDB.Core.IdMeta &
      PouchDB.Core.GetMeta)
    return typedData
  }
  private update = async (partial: Partial<GoiSettingsDataType>) => {
    const data = await this.read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
}
export const GoiSettings = (settingsDbKey: GoiSettingsDbKey) => {
  return new GoiSettingsModel(settingsDbKey)
}
