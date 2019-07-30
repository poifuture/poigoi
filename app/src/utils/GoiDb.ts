import "isomorphic-fetch"
import PouchDB from "pouchdb-browser"
import { DbKey } from "./PoiDb"

class GoiPouchDB extends PouchDB {
  getOrNull = async <Model>(dbKey: DbKey) => {
    console.debug("Getting or null: ", dbKey)
    try {
      return await super.get<Model>(dbKey)
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
export const GoiDb = () => {
  if (!singletonDb) {
    console.debug("Initilizing PouchDB connection...")
    singletonDb = new GoiPouchDB("PoiGoi")
  }
  return singletonDb
}

export const GoiNS = "3bebe461-2f53-419c-b7b7-e626f9ce0a6b"
