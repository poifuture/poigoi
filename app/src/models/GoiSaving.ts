import uuid5 from "uuid/v5"
import {
  DbUuid,
  PoiGlobalDataType,
  GlobalDbKey,
  TimeStamp,
} from "../utils/PoiDb"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"

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
  readonly SavingId: GoiSavingId
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
  readonly SavingId: GoiSavingId
  readonly PoiUserId: PoiUser.PoiUserId
  Level: number
  Pending: OrderKey
  Prioritized: OrderKey
  History: { [time: number]: GoiWordHistoryDbKey }
}
const DefaultGoiWordRecord: Partial<GoiWordRecordDataType> = {
  // Defaulter is mainly used for reading legacy schema
  DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1",
  Level: 0,
  Pending: "",
  Prioritized: "",
  History: {},
}

export class GoiWordRecordModel {
  public static GetDbKey = (
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    wordKey: string
  ): GoiWordRecordDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Savings/${savingId}/WordRecords/${wordKey}` as GoiWordRecordDbKey
  }
  private dbKey: GoiWordRecordDbKey
  constructor(dbKey: GoiWordRecordDbKey) {
    this.dbKey = dbKey
  }
  static Create = async (
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    wordKey: string
  ): Promise<GoiWordRecordDbKey> => {
    //static builder
    const dbKey: GoiWordRecordDbKey = GoiWordRecordModel.GetDbKey(
      poiUserId,
      savingId,
      wordKey
    )
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS) as DbUuid
    const newData: GoiWordRecordDataType = {
      ...DefaultGoiWordRecord,
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      WordKey: wordKey,
      SavingId: savingId,
      PoiUserId: poiUserId,
      Level: 0,
      Pending: "",
      Prioritized: "",
      History: {},
    }
    await GoiDb().put<GoiWordRecordDataType>({
      _id: dbKey,
      ...newData,
    })
    return dbKey
  }
  onSync?: (error?: any) => Promise<void>
  sync = async () => {
    console.error("TODO: Sync")
    this.onSync && this.onSync()
  }
  ReadOrNull = async (): Promise<
    (GoiWordRecordDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta) | null
  > => {
    const data = await GoiDb().getOrNull<GoiWordRecordDataType>(this.dbKey)
    if (!data) {
      return null
    }
    return { ...DefaultGoiWordRecord, ...data }
  }
  Read = async (): Promise<
    GoiWordRecordDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
  > => {
    const data = await GoiDb().get<GoiWordRecordDataType>(this.dbKey)
    return { ...DefaultGoiWordRecord, ...data }
  }
  private update = async (partial: Partial<GoiWordRecordDataType>) => {
    const data = await this.Read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  SetPending = async (orderKey: string) => {
    const wordRecord = await this.Read()
    if (wordRecord.Level > 0 || wordRecord.Prioritized || wordRecord.Pending) {
      console.debug("Already added word: ", wordRecord.WordKey)
      return
    }
    await this.update({ Pending: orderKey })
  }
}
export const GoiWordRecord = (wordRecordDbKey: GoiWordRecordDbKey) => {
  return new GoiWordRecordModel(wordRecordDbKey)
}

export interface GoiSavingDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/Entry
  // Schema: Poi/Goi/PoiUser/Saving/Entry/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1"
  readonly PoiUserId: PoiUser.PoiUserId
  readonly SavingId: GoiSavingId
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
    savingId: GoiSavingId
  ): GoiSavingDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Savings/${savingId}/Entry` as GoiSavingDbKey
  }
  public static GenerateId = (): GoiSavingId => {
    return ((Math.random() * 0xffffffff) >>> 0).toString(16) as GoiSavingId
  }
  private dbKey: GoiSavingDbKey
  constructor(dbKey: GoiSavingDbKey) {
    this.dbKey = dbKey
  }
  static Create = async (
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId
  ): Promise<GoiSavingDbKey> => {
    //static builder
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
  ReadOrNull = async (): Promise<
    (GoiSavingDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta) | null
  > => {
    const data = await GoiDb().getOrNull<GoiSavingDataType>(this.dbKey)
    if (!data) {
      return null
    }
    return { ...DefaultGoiSaving, ...data }
  }
  Read = async (): Promise<
    GoiSavingDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
  > => {
    const data = await GoiDb().get<GoiSavingDataType>(this.dbKey)
    return { ...DefaultGoiSaving, ...data }
  }
  private update = async (partial: Partial<GoiSavingDataType>) => {
    const data = await this.Read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
}
export const GoiSaving = (savingDbKey: GoiSavingDbKey) => {
  return new GoiSavingModel(savingDbKey)
}
