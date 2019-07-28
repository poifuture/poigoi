import PouchDB from "pouchdb-browser"
import { DbKey } from "./PoiDb"

class GoiPouchDB extends PouchDB {
  getOrNull = async <Model>(dbKey: DbKey) => {
    console.debug("Getting or null: ", dbKey)
    try {
      return await super.get<Model>(dbKey)
    } catch (error) {
      if (error.status && error.status === 404) {
        return null
      }
      throw error
    }
  }
  public static db = new GoiPouchDB("PoiGoi")
}
export const GoiDb = () => {
  return GoiPouchDB.db
}

export const GoiNS = "3bebe461-2f53-419c-b7b7-e626f9ce0a6b"
