import uuid5 from "uuid/v5"
import {
  DbUuid,
  PoiGlobalDataType,
  GlobalDbKey,
  TimeStamp,
  DbSchema,
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

export interface GoiWordRecordDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordRecords/:WordKey
  // Schema: Poi/Goi/PoiUser/Saving/WordRecord/v1
  readonly DbKey: GoiWordRecordDbKey
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1"
  readonly WordKey: string
  readonly SavingId: GoiSavingId
  readonly PoiUserId: PoiUser.PoiUserId
  Level: number
  NextTime: TimeStamp
  Pending: OrderKey
  Prioritized: OrderKey
  History: { [time: number]: GoiWordHistoryDbKey }
}
type GoiWordRecordPouchType = GoiWordRecordDataType &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta

export class GoiWordRecordModel {
  public static GetDbKey = (
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    wordKey: string
  ): GoiWordRecordDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Savings/${savingId}/WordRecords/${wordKey}` as GoiWordRecordDbKey
  }
  private readonly dbKey: GoiWordRecordDbKey
  private readonly poiUserId: PoiUser.PoiUserId
  private readonly savingId: GoiSavingId
  private readonly wordKey: string
  constructor(
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    wordKey: string
  ) {
    this.dbKey = GoiWordRecordModel.GetDbKey(poiUserId, savingId, wordKey)
    this.poiUserId = poiUserId
    this.savingId = savingId
    this.wordKey = wordKey
  }
  private DefaultData = (): GoiWordRecordDataType => {
    return {
      DbKey: this.dbKey,
      DbUuid: uuid5(this.dbKey, GoiNS) as DbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/WordRecord/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      WordKey: this.wordKey,
      SavingId: this.savingId,
      PoiUserId: this.poiUserId,
      Level: 0,
      NextTime: 0,
      Pending: "",
      Prioritized: "",
      History: {},
    }
  }
  Exists = async (): Promise<boolean> => {
    return await GoiDb().Exists(this.dbKey)
  }
  Create = async (): Promise<GoiWordRecordDbKey> => {
    //static builder
    const newData: GoiWordRecordDataType = this.DefaultData()
    await GoiDb().put<GoiWordRecordDataType>({
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
  private UpgradeSchema = async (
    oldSchema: DbSchema
  ): Promise<GoiWordRecordPouchType | null> => {
    switch (oldSchema) {
      case "Poi/Goi/PoiUser/Saving/WordRecord/v1": {
        return null
      }
    }
    return null
  }

  Read = async (): Promise<GoiWordRecordPouchType> => {
    const possibleOldData = await GoiDb().Get<GoiWordRecordDataType>(this.dbKey)
    const oldSchema = (possibleOldData as any).DbSchema as DbSchema
    const data = (await this.UpgradeSchema(oldSchema)) || possibleOldData
    return { ...this.DefaultData(), ...data }
  }
  private update = async (partial: Partial<GoiWordRecordDataType>) => {
    const data = await this.Read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  ReadOrCreate = async (): Promise<GoiWordRecordPouchType> => {
    if (!(await this.Exists())) {
      await this.Create()
    }
    return await this.Read()
  }
  ReadOrNull = async (): Promise<GoiWordRecordPouchType | null> => {
    if (!(await this.Exists())) {
      return null
    }
    return await this.Read()
  }
  SetPending = async (orderKey: string) => {
    const wordRecord = await this.Read()
    if (wordRecord.Level > 0 || wordRecord.Prioritized || wordRecord.Pending) {
      console.debug("Already added word: ", wordRecord.WordKey)
      return
    }
    await this.update({ Pending: orderKey })
  }
  ClearPending = async () => {
    await this.update({ Pending: "" })
  }
}
export const GoiWordRecord = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId,
  wordKey: string
) => {
  return new GoiWordRecordModel(poiUserId, savingId, wordKey)
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
    const data = await GoiDb().GetOrNull<GoiSavingDataType>(this.dbKey)
    if (!data) {
      return null
    }
    return { ...DefaultGoiSaving, ...data }
  }
  Read = async (): Promise<
    GoiSavingDataType & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
  > => {
    const data = await GoiDb().Get<GoiSavingDataType>(this.dbKey)
    return { ...DefaultGoiSaving, ...data }
  }
  private update = async (partial: Partial<GoiSavingDataType>) => {
    const data = await this.Read()
    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  AttachRecords = async (wordKeys: string[]): Promise<void> => {
    if (!(wordKeys.length > 0)) {
      return
    }
    const data = await this.Read()
    const poiUserId = data.PoiUserId
    const savingId = data.SavingId
    // shadow copy
    const records: { [key: string]: GoiWordRecordDbKey } = Object.assign(
      {},
      data.Records
    )
    wordKeys.map(wordKey => {
      records[wordKey] = GoiWordRecordModel.GetDbKey(
        poiUserId,
        savingId,
        wordKey
      )
    })
    await this.update({ Records: records })
  }
  GetDictionarys = async () => {
    const data = await this.Read()
    return data.Dictionarys
  }
  GetRecords = async () => {
    const data = await this.Read()
    const wordRecords = await Promise.all(
      Object.keys(data.Records).map(
        async wordKey =>
          await GoiWordRecord(
            data.PoiUserId,
            data.SavingId,
            wordKey
          ).ReadOrCreate()
      )
    )
    return wordRecords
  }
  ClearPendings = async (wordKeys: string[]) => {
    const data = await this.Read()
    const poiUserId = data.PoiUserId
    const savingId = data.SavingId
    await Promise.all(
      wordKeys.map(async wordKey => {
        await GoiWordRecord(poiUserId, savingId, wordKey).ClearPending()
      })
    )
  }
}
export const GoiSaving = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId
) => {
  return new GoiSavingModel(GoiSavingModel.GetDbKey(poiUserId, savingId))
}
