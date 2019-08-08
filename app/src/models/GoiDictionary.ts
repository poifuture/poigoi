import uuid5 from "uuid/v5"
import Immutable, { fromJS } from "immutable"
import { GoiDb, GoiNS } from "../utils/GoiDb"
import { DbUuid, GlobalDbKey, PoiGlobalDataType } from "../utils/PoiDb"
import { GoiJaWordType, GoiWordType } from "../types/GoiDictionaryTypes"
import KanaDictionary from "../dictionary/KanaDictionary"
import GoiSimpleJaDictionary from "../dictionary/GoiSimpleJaDictionary"
import BiaozhunRibenyu from "../dictionary/BiaozhunRibenyu"

export type GoiDictionaryDbKey = GlobalDbKey & {
  readonly brand: "GoiDictionaryDbKey"
}
export type GoiDictionaryWordDbKey = GlobalDbKey & {
  readonly brand: "GoiDictionaryWordDbKey"
}

interface GoiDictionaryWordDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/Dictionarys/:DictionaryName/Words/:WordKey/Entry
  // Schema: Poi/Goi/Dictionary/Word/Entry/v1
  readonly DbSchema: string
  readonly WordKey: string
  readonly DictionaryName: string
  Content: GoiWordType
}

interface GoiJaDictionaryWordDataType extends GoiDictionaryWordDataType {
  // PoiGlobalDbKey: Poi/Goi/Dictionarys/:DictionaryName/Words/:WordKey/Entry
  // Schema: Poi/Goi/Dictionary/Word/Entry/ja/v1
  readonly DbSchema: "Poi/Goi/Dictionary/Word/Entry/ja/v1"
  Content: GoiJaWordType
}

interface GoiDictionaryDataType extends PoiGlobalDataType {
  // PoiGlobalDbKey: Poi/Goi/Dictionarys/:DictionaryName/Entry
  // Schema: Poi/Goi/Dictionary/Entry/v1
  readonly DbSchema: "Poi/Goi/Dictionary/Entry/v1"
  readonly DictionaryName: string
  Words: { [key: string]: GoiDictionaryWordDbKey }
}

class GoiDictionaryWordModel {
  public static GetDbKey = (
    dictionaryName: string,
    wordKey: string
  ): GoiDictionaryWordDbKey => {
    return `Poi/Goi/Dictionarys/${dictionaryName}/Words/${wordKey}/Entry` as GoiDictionaryWordDbKey
  }
  private dbKey: GoiDictionaryWordDbKey
  constructor(dbKey: GoiDictionaryWordDbKey) {
    this.dbKey = dbKey
  }
  ReadOrNull = async () => {
    return await GoiDb().GetOrNull<GoiDictionaryWordDataType>(this.dbKey)
  }
}

export class GoiDictionaryModel {
  public static GetDbKey = (dictionaryName: string): GoiDictionaryDbKey => {
    return `Poi/Goi/Dictionarys/${dictionaryName}/Entry` as GoiDictionaryDbKey
  }
  public static Create = async (
    dictionaryName: string
  ): Promise<GoiDictionaryDbKey> => {
    console.debug("Creating GoiDictionary from name: ", dictionaryName)
    const dbKey: GoiDictionaryDbKey = GoiDictionaryModel.GetDbKey(
      dictionaryName
    ) // `Poi/Goi/PoiUser/${poiUserId}/Entry`
    const dbUuid: DbUuid = uuid5(dbKey, GoiNS) as DbUuid
    const newData: GoiDictionaryDataType = {
      DbKey: dbKey,
      DbUuid: dbUuid,
      DbSchema: "Poi/Goi/Dictionary/Entry/v1",
      LocalRev: { Hash: "", Time: 0 },
      BaseRev: { Hash: "", Time: 0 },
      DictionaryName: dictionaryName,
      Words: {},
    }
    await GoiDb().put({
      _id: dbKey,
      ...newData,
    })
    return dbKey
  }

  private dbKey: GoiDictionaryDbKey
  private dictionaryName: string = ""
  constructor(
    dbKey: GoiDictionaryDbKey,
    options?: { dictionaryName?: string }
  ) {
    this.dbKey = dbKey
    if (options) {
      if (options.dictionaryName) {
        const dbKeyFromOptions = GoiDictionaryModel.GetDbKey(
          options.dictionaryName
        )
        if (dbKeyFromOptions !== this.dbKey) {
          throw new Error(
            `DbKey mismatch: ${options.dictionaryName} and ${dbKey}`
          )
        }
        this.dictionaryName = options.dictionaryName
      }
    }
  }
  Exists = async (): Promise<boolean> => {
    return await GoiDb().Exists(this.dbKey)
  }
  private Read = async () => {
    return await GoiDb().Get<GoiDictionaryDataType>(this.dbKey)
  }
  private update = async (partial: Partial<GoiDictionaryDataType>) => {
    console.debug("Updating GoiDictionary: ", partial)
    const data = await this.Read()

    await GoiDb().put({
      ...data,
      ...partial,
    })
  }
  private getDictionaryName = async () => {
    if (this.dictionaryName) {
      return this.dictionaryName
    }
    const dictionaryEntry = await this.Read()
    this.dictionaryName = dictionaryEntry.DictionaryName
    return this.dictionaryName
  }
  GetWordOrNull = async <T extends GoiWordType>(
    wordKey: string
  ): Promise<T | null> => {
    const dictionaryName = await this.getDictionaryName()
    switch (dictionaryName) {
      case "KanaDictionary": {
        if (!(wordKey in KanaDictionary.words)) {
          return null
        }
        return (KanaDictionary.words[wordKey] as GoiWordType) as T
      }
      case "GoiSimpleJaDictionary": {
        // console.debug("TODO:read from database")
        // TODO:read from database
        if (!(wordKey in GoiSimpleJaDictionary.words)) {
          return null
        }
        return (GoiSimpleJaDictionary.words[wordKey] as GoiWordType) as T
      }
      case "BiaozhunRibenyu": {
        // console.debug("TODO:read from database")
        // TODO:read from database
        if (!(wordKey in BiaozhunRibenyu.words)) {
          return null
        }
        return (BiaozhunRibenyu.words[wordKey] as GoiWordType) as T
      }
    }
    // TODO:read from database
    const wordDbKey = GoiDictionaryWordModel.GetDbKey(dictionaryName, wordKey)
    const wordData = await new GoiDictionaryWordModel(wordDbKey).ReadOrNull()
    return wordData && (wordData.Content as T)
  }
  GetAllWordsKeys = async (): Promise<Immutable.Set<string>> => {
    const dictionaryName = await this.getDictionaryName()
    // TODO:read from database
    switch (dictionaryName) {
      case "KanaDictionary": {
        return Immutable.Set.fromKeys(KanaDictionary.words)
      }
      case "GoiSimpleJaDictionary": {
        return Immutable.Set.fromKeys(GoiSimpleJaDictionary.words)
      }
      case "BiaozhunRibenyu": {
        return Immutable.Set.fromKeys(BiaozhunRibenyu.words)
      }
    }
    // TODO:read from database
    if (!(await this.Exists())) {
      return Immutable.Set()
    }
    const dictionaryEntry = await this.Read()
    return Immutable.Set.fromKeys(dictionaryEntry.Words)
  }
}
const GoiDictionary = (dictionaryName: string) => {
  const dbKey = GoiDictionaryModel.GetDbKey(dictionaryName)
  return new GoiDictionaryModel(dbKey, { dictionaryName })
}

export class GoiDictionaryCollection {
  private dictionaryNames: string[]
  constructor(dictionaryNames: string[]) {
    this.dictionaryNames = dictionaryNames.slice(0)
  }
  mergeWord = <T extends GoiWordType>(base: T, supplement: T): T => {
    return fromJS(supplement)
      .mergeDeep(fromJS(base))
      .toJS()
  }
  GetWordOrNull = async <T extends GoiWordType>(
    wordKey: string
  ): Promise<T | null> => {
    let wordData: T | null = null
    for (let index = 0; index < this.dictionaryNames.length; index++) {
      const tmpWordData = await GoiDictionary(
        this.dictionaryNames[index]
      ).GetWordOrNull<T>(wordKey)
      if (!wordData) {
        wordData = tmpWordData
      } else if (tmpWordData) {
        wordData = this.mergeWord(wordData, tmpWordData)
      }
    }
    return wordData
  }
  GetAllWordsKeys = async (): Promise<Immutable.Set<string>> => {
    const wordKeys = await Promise.all(
      this.dictionaryNames.map(async dictionaryName => {
        return await GoiDictionary(dictionaryName).GetAllWordsKeys()
      })
    )
    return Immutable.Set.union(wordKeys)
  }
}

export const GoiDictionarys = (dictionaryNames: string[]) => {
  return new GoiDictionaryCollection(dictionaryNames)
}
