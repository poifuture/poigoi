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
export type GoiWordRecordDbKey = GlobalDbKey & {
  readonly brand: "GoiWordRecordDbKey"
}
export type GoiWordHistoryDbKey = GlobalDbKey & {
  readonly brand: "GoiWordHistoryDbKey"
}

export type OrderKey = string & { readonly brand?: "OrderKey" }
export type JudgeResult = "Correct" | "Accepted" | "Wrong" | "Skip"

export interface GoiWordHistoryDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordHistorys/:JudgeTime
  // Schema: Poi/Goi/PoiUser/Saving/WordHistory/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/WordHistory/v1"
  readonly JudgeTime: TimeStamp
  readonly SavingId: string
  readonly PoiUserId: PoiUser.PoiUserId
  WordKey: string
  JudgeResult: JudgeResult
  LevelBefore: number
  LevelAfter: number
}
const DefaultGoiWordHistory: Partial<GoiWordHistoryDataType> = {
  // Defaulter is mainly used for reading legacy schema
  DbSchema: "Poi/Goi/PoiUser/Saving/WordHistory/v1",
  WordKey: "",
  JudgeResult: "Skip",
  LevelBefore: 0,
  LevelAfter: 0,
}

export interface GoiWordRecordDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordRecords/:WordKey
  // Schema: Poi/Goi/PoiUser/Saving/WordRecord/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1"
  readonly WordKey: string
  readonly SavingId: string
  readonly PoiUserId: PoiUser.PoiUserId
  Pending: OrderKey
  Prioritized: OrderKey
  History: { [time: number]: GoiWordHistoryDbKey }
}
const DefaultGoiWordRecord: Partial<GoiWordRecordDataType> = {
  // Defaulter is mainly used for reading legacy schema
  DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1",
  Pending: "",
  Prioritized: "",
  History: {},
}

export interface GoiSavingDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/Entry
  // Schema: Poi/Goi/PoiUser/Saving/Entry/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1"
  readonly PoiUserId: PoiUser.PoiUserId
  readonly SavingId: string
  Judgement: "Typing" | "Selection"
  Term: "Permanant" | "Temporary"
  Dictionarys: string[]
  Records: { [key: string]: GoiWordRecordDbKey }
}
const DefaultGoiSaving: Partial<GoiSavingDataType> = {
  // Defaulter is mainly used for reading legacy schema
  DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1",
  Judgement: "Typing",
  Term: "Permanant",
  Dictionarys: ["KanaDictionary", "SimpleJaDictionary"],
  Records: {},
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
      ...DefaultGoiSaving,
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: poiUserId,
      SavingId: savingId,
      Judgement: "Typing",
      Term: "Permanant",
      Dictionarys: ["KanaDictionary", "SimpleJaDictionary"],
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
  read = async (): Promise<
    GoiSavingDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
  > => {
    const data = await GoiDb().get<GoiSavingDataType>(this.dbKey)
    return { ...DefaultGoiSaving, ...data }
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
