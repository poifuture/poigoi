import uuid5 from "uuid/v5"
import {
  DbUuid,
  PoiGlobalDataType,
  GlobalDbKey,
  TimeStamp,
} from "../utils/PoiDb"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"

export type GoiSavingDbKey = GlobalDbKey & { readonly brand: "GoiSavingDbKey" }

export type OrderKey = string & { readonly brand?: "OrderKey" }
export type JudgeResult = "Correct" | "Accepted" | "Wrong" | "Skip"

export interface GoiWordHistoryDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordHistorys/:JudgeTime
  // Schema: Poi/Goi/PoiUser/Saving/WordHistory/v1
  DbSchema: "Poi/Goi/PoiUser/Saving/WordHistory/v1"
  WordKey: string
  JudgeResult: JudgeResult
  JudgeTime: TimeStamp
  LevelBefore: number
  LevelAfter: number
}
export interface GoiWordRecordDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordRecords/:WordKey
  // Schema: Poi/Goi/PoiUser/Saving/WordRecord/v1
  DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1"
  WordKey: string
  SavingDbKey: GoiSavingDbKey
  PoiUserId: PoiUser.PoiUserId
  Pending: OrderKey
  Prioritized: OrderKey
  History: GlobalDbKey[]
}

export interface GoiSavingDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/Entry
  // Schema: Poi/Goi/PoiUser/Saving/Entry/v1
  DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1"
  PoiUserId: PoiUser.PoiUserId
  Judgement: "Typing" | "Selection"
  Term: "Permanant" | "Temporary"
  Records: { [Common: string]: DbUuid }
}

export class GoiSavingModel {
  public static GetDbKey = (
    poiUserId: PoiUser.PoiUserId,
    savingId: string
  ): GoiSavingDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Savings/${savingId}/Entry` as GoiSavingDbKey
  }
  private dbKey: GoiSavingDbKey
  constructor(dbKey: GoiSavingDbKey) {
    this.dbKey = dbKey
  }
  static Create = async (
    poiUserId: PoiUser.PoiUserId
  ): Promise<GoiSavingDbKey> => {
    //static builder
    const savingId = ((Math.random() * 0xffffffff) >>> 0).toString(16)
    const dbKey: GoiSavingDbKey = GoiSavingModel.GetDbKey(poiUserId, savingId)
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS) as DbUuid
    const newData: GoiSavingDataType = {
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      Judgement: "Typing",
      Term: "Permanant",
      Records: {},
    }
    await GoiDb().put({
      _id: dbKey,
      ...newData,
    })
    const newSaving = new GoiSavingModel(dbKey)
    newSaving.sync()
    return dbKey
  }
  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  read = async () => {
    const data = await GoiDb().get(this.dbKey)
    const typedData = data as (GoiSavingDataType &
      PouchDB.Core.IdMeta &
      PouchDB.Core.GetMeta)
    return typedData
  }
  private update = async (partial: Partial<GoiSavingDataType>) => {
    const data = await this.read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
}
export const GoiSaving = (savingDbKey: GoiSavingDbKey) => {
  return new GoiSavingModel(savingDbKey)
}
