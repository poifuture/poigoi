import uuid5 from "uuid/v5"
import { DbUuid, PoiGlobalDataType, GlobalDbKey } from "../utils/PoiDb"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"

export interface GoiSettingsDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Settings
  // Schema: Poi/Goi/PoiUser/Settings/v1
  DbSchema: "Poi/Goi/PoiUser/Settings/v1"
  PoiUserId: PoiUser.PoiUserId
  autoSync: boolean
  locale: "zh-cn" | "zh-c2"
}

export class GoiSettingsModel {
  private dbKey: GlobalDbKey = ""
  constructor(dbKey: GlobalDbKey) {
    this.dbKey = dbKey
  }
  static Create = async (
    poiUserId: PoiUser.PoiUserId
  ): Promise<GlobalDbKey> => {
    //static builder
    const dbKey: GlobalDbKey = `Poi/Goi/PoiUsers/${poiUserId}/Settings`
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS)
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
  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  private read = async () => {
    const data = await GoiDb().get(this.dbKey)
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
export const GoiSettings = (settingsDbKey: GlobalDbKey) => {
  return new GoiSettingsModel(settingsDbKey)
}
