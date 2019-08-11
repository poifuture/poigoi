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
import { GoiSavingId, GoiJudgeResult } from "../types/GoiTypes"

export type GoiSavingDbKey = GlobalDbKey & { readonly brand: "GoiSavingDbKey" }
export type GoiWordRecordDbKey = GlobalDbKey & {
  readonly brand: "GoiWordRecordDbKey"
}
export type GoiWordHistoryDbKey = GlobalDbKey & {
  readonly brand: "GoiWordHistoryDbKey"
}

export type OrderKey = string & { readonly brand?: "OrderKey" }

export interface GoiWordHistoryDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/PoiUsers/:PoiUserId/Savings/:SavingId/WordHistorys/:JudgeTime
  // Schema: Poi/Goi/PoiUser/Saving/WordHistory/v1
  readonly DbSchema: "Poi/Goi/PoiUser/Saving/WordHistory/v1"
  readonly JudgeTime: TimeStamp
  readonly SavingId: GoiSavingId
  readonly PoiUserId: PoiUser.PoiUserId
  WordKey: string
  JudgeResult: GoiJudgeResult
  LevelBefore: number
  LevelAfter: number
}
export type GoiWordHistoryPouchType = GoiWordHistoryDataType &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta

export class GoiWordHistoryModel {
  public static GetDbKey = (
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    judgeTime: TimeStamp
  ): GoiWordHistoryDbKey => {
    return `Poi/Goi/PoiUsers/${poiUserId}/Savings/${savingId}/WordHistorys/${judgeTime
      .toString()
      .padStart(20, "0")}` as GoiWordHistoryDbKey
  }
  private readonly dbKey: GoiWordHistoryDbKey
  private readonly poiUserId: PoiUser.PoiUserId
  private readonly savingId: GoiSavingId
  private readonly judgeTime: TimeStamp
  constructor(
    poiUserId: PoiUser.PoiUserId,
    savingId: GoiSavingId,
    judgeTime: TimeStamp
  ) {
    this.dbKey = GoiWordHistoryModel.GetDbKey(poiUserId, savingId, judgeTime)
    this.poiUserId = poiUserId
    this.savingId = savingId
    this.judgeTime = judgeTime
  }
  private DefaultData = (): GoiWordHistoryDataType => {
    return {
      DbKey: this.dbKey,
      DbUuid: uuid5(this.dbKey, GoiNS) as DbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/WordHistory/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      JudgeTime: this.judgeTime,
      SavingId: this.savingId,
      PoiUserId: this.poiUserId,
      WordKey: "",
      JudgeResult: "Skipped",
      LevelBefore: 0,
      LevelAfter: 0,
    }
  }
  Exists = async (): Promise<boolean> => {
    return await GoiDb().Exists(this.dbKey)
  }
  Create = async ({
    wordKey,
    judgeResult,
    levelBefore,
    levelAfter,
  }: {
    wordKey: string
    judgeResult: GoiJudgeResult
    levelBefore: number
    levelAfter: number
  }): Promise<GoiWordHistoryDbKey> => {
    //static builder
    const newData: GoiWordHistoryDataType = this.DefaultData()
    await GoiDb().put<GoiWordHistoryDataType>({
      _id: this.dbKey,
      ...newData,
      WordKey: wordKey,
      JudgeResult: judgeResult,
      LevelBefore: levelBefore,
      LevelAfter: levelAfter,
    })
    return this.dbKey
  }
  private UpgradeSchema = async (
    oldSchema: DbSchema
  ): Promise<GoiWordHistoryPouchType | null> => {
    switch (oldSchema) {
      case "Poi/Goi/PoiUser/Saving/WordHistory/v1": {
        return null
      }
    }
    return null
  }

  Read = async (): Promise<GoiWordHistoryPouchType> => {
    const possibleOldData = await GoiDb().Get<GoiWordHistoryDataType>(
      this.dbKey
    )
    const oldSchema = (possibleOldData as any).DbSchema as DbSchema
    const data = (await this.UpgradeSchema(oldSchema)) || possibleOldData
    return { ...this.DefaultData(), ...data }
  }
  private update = async (partial: Partial<GoiWordHistoryDataType>) => {
    const data = await this.Read()
    await GoiDb().put<GoiWordHistoryDataType>({
      ...data,
      ...partial,
    })
  }
  ReadOrNull = async (): Promise<GoiWordHistoryPouchType | null> => {
    if (!(await this.Exists())) {
      return null
    }
    return await this.Read()
  }
}
export const GoiWordHistory = (
  poiUserId: PoiUser.PoiUserId,
  savingId: GoiSavingId,
  judgeTime: TimeStamp
) => {
  return new GoiWordHistoryModel(poiUserId, savingId, judgeTime)
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
  FrozenTime: TimeStamp
  NextTime: TimeStamp
  Pending: OrderKey
  Prioritied: OrderKey
  Historys: { [time: number]: GoiWordHistoryDbKey }
}
export type GoiWordRecordPouchType = GoiWordRecordDataType &
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
      FrozenTime: 0,
      NextTime: 0,
      Pending: "",
      Prioritied: "",
      Historys: {},
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
  SetLevel = async (level: number) => {
    if (level <= 0 || level >= 100) {
      console.error("Invalid word level: ", level)
      return
    }
    await this.update({ Level: level, Prioritied: "", Pending: "" })
  }
  SetPrioritied = async (orderKey: string) => {
    const wordRecord = await this.Read()
    if (wordRecord.Level > 0) {
      console.error("Already learned word: ", wordRecord.WordKey)
      return
    }
    await this.update({ Prioritied: orderKey, Pending: "" })
  }
  SetPending = async (orderKey: string) => {
    const wordRecord = await this.Read()
    if (wordRecord.Level > 0 || wordRecord.Prioritied || wordRecord.Pending) {
      console.debug("Already added word: ", wordRecord.WordKey)
      return
    }
    await this.update({ Pending: orderKey })
  }
  ClearPending = async () => {
    await this.update({ Pending: "" })
  }
  Trash = async () => {
    await this.update({ Level: 0, Prioritied: "", Pending: "" })
  }
  SetFrozenTime = async (nextTime: TimeStamp) => {
    await this.update({ NextTime: nextTime })
  }
  SetNextTime = async (nextTime: TimeStamp) => {
    await this.update({ NextTime: nextTime })
  }
  AttachHistory = async ({
    judgeTime,
    historyDbKey,
  }: {
    judgeTime: TimeStamp
    historyDbKey: GoiWordHistoryDbKey
  }) => {
    const data = await this.Read()
    const newHistorys: { [time: number]: GoiWordHistoryDbKey } = Object.assign(
      {},
      data.Historys
    )
    newHistorys[judgeTime] = historyDbKey
    await this.update({ Historys: newHistorys })
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
  Judgement: "Typing" | "Selection" | "Swipe"
  Term: "Permanant" | "Temporary"
  Language: "ja" | "ja-jp" | "en" | "en-us" | "zh" | "zh-cn" | "zh-c2"
  Dictionarys: string[]
  Records: { [key: string]: GoiWordRecordDbKey }
}
export type GoiSavingPouchType = GoiSavingDataType &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta

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
  private readonly dbKey: GoiSavingDbKey
  private readonly poiUserId: PoiUser.PoiUserId
  private readonly savingId: GoiSavingId
  constructor(poiUserId: PoiUser.PoiUserId, savingId: GoiSavingId) {
    this.poiUserId = poiUserId
    this.savingId = savingId
    this.dbKey = GoiSavingModel.GetDbKey(poiUserId, savingId)
  }
  private DefaultData = (): GoiSavingDataType => {
    return {
      DbKey: this.dbKey,
      DbUuid: uuid5(this.dbKey, GoiNS) as DbUuid,
      DbSchema: "Poi/Goi/PoiUser/Saving/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      PoiUserId: this.poiUserId,
      SavingId: this.savingId,
      Judgement: "Typing",
      Term: "Permanant",
      Language: "ja",
      Dictionarys: [
        "KanaDictionary",
        "GoiSimpleJaDictionary",
        "BiaozhunRibenyu",
        "XinbianRiyu",
      ],
      Records: {},
    }
  }
  Exists = async (): Promise<boolean> => {
    return await GoiDb().Exists(this.dbKey)
  }
  Create = async (): Promise<GoiSavingDbKey> => {
    //static builder
    const newData: GoiSavingDataType = this.DefaultData()
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
  Read = async (): Promise<GoiSavingPouchType> => {
    const data = await GoiDb().Get<GoiSavingDataType>(this.dbKey)
    return {
      ...this.DefaultData(),
      ...data,
      Dictionarys: this.DefaultData().Dictionarys,
    }
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
  return new GoiSavingModel(poiUserId, savingId)
}
