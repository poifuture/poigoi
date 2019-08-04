import "isomorphic-fetch"
import PouchDB from "pouchdb-browser"
import PouchDBDebug from "pouchdb-debug"
import { DbKey } from "./PoiDb"

class GoiPouchDB extends PouchDB {
  private cache: { [key: string]: any } = {}
  Exists = async (dbKey: DbKey): Promise<boolean> => {
    try {
      await this.Get(dbKey)
      return true
    } catch (error) {
      if (error.status && error.status === 404) {
        console.debug("Miss DbKey: ", dbKey)
        return false
      }
      throw error
    }
  }
  Get = async <Model>(dbKey: DbKey) => {
    const data = await super.get<Model>(dbKey)
    this.cache[dbKey] = data
    return data
  }
  GetOrNull = async <Model>(dbKey: DbKey) => {
    try {
      return await this.Get<Model>(dbKey)
    } catch (error) {
      if (error.status && error.status === 404) {
        console.debug("Miss DbKey: ", dbKey)
        return null
      }
      throw error
    }
  }
}

let singletonDb: GoiPouchDB | null = null
export const GoiDb = (options?: { test?: boolean }) => {
  if (options && options.test) {
    singletonDb = new GoiPouchDB("PoiGoi", { adapter: "memory" })
  }
  if (!singletonDb) {
    console.debug("Initilizing PouchDB connection...")
    PouchDB.plugin(PouchDBDebug)
    PouchDB.debug.enable("pouchdb:api")
    singletonDb = new GoiPouchDB("PoiGoi")
  }
  return singletonDb
}

export const GoiNS = "3bebe461-2f53-419c-b7b7-e626f9ce0a6b"
