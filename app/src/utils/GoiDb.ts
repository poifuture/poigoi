import "isomorphic-fetch"
import PouchDB from "pouchdb-browser"
import PouchDBDebug from "pouchdb-debug"
import { DbKey, LocalDbKey } from "./PoiDb"
import DebugModule from "debug"
import * as PoiUser from "./PoiUser"
const debug = DebugModule("PoiGoi:GoiDb")

export interface GoiDbRange {
  startkey: string
  endkey: string
}

class GoiPouchDB extends PouchDB {
  private cache: { [key: string]: any } = {}
  Exists = async (dbKey: DbKey): Promise<boolean> => {
    try {
      await this.Get(dbKey)
      return true
    } catch (error) {
      if (error.status && error.status === 404) {
        debug("Miss DbKey: ", dbKey)
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
        debug("Miss DbKey: ", dbKey)
        return null
      }
      throw error
    }
  }
}

let singletonDb: GoiPouchDB | null = null
let remoteDb = null
export const GoiDb = (options?: { test?: boolean }) => {
  if (options && options.test) {
    singletonDb = new GoiPouchDB("PoiGoi", { adapter: "memory" })
  }
  if (!singletonDb) {
    debug("Initilizing PouchDB connection...")
    if (process.env.GOI_DEBUG) {
      PouchDB.plugin(PouchDBDebug)
      PouchDB.debug.enable("pouchdb:api")
    }
    singletonDb = new GoiPouchDB("PoiGoi")
  }
  return singletonDb
}

export const RemotePouchDbAddress: string = "127.0.0.1:3000"
export const RemoteGoiApiAddress: string = "127.0.0.1:3000"

export const RemoteLogIn = async (
  remotePouchDBUsername: string,
  remotePouchDBPassword: string
) => {
  const remoteDbUrl = `http://${RemotePouchDbAddress}/${remotePouchDBUsername}`
  remoteDb = new PouchDB(remoteDbUrl, {
    auth: {
      username: remotePouchDBUsername,
      password: remotePouchDBPassword,
    },
  })
  return PouchDB.sync(GoiDb(), remoteDb, {
    live: true,
    retry: true,
  })
  // .on("change", info => {
  //   debug("change")
  //   debug(info)
  // })
  // .on("paused", err => {
  //   debug("paused")
  //   debug(err)
  // })
  // .on("active", () => {
  //   debug("active")
  // })
  // .on("denied", err => {
  //   debug("denied")
  //   debug(err)
  // })
  // .on("complete", info => {
  //   debug("complete")
  //   debug(info)
  // })
  // .on("error", err => {
  //   debug("error")
  //   debug(err)
  // })
}

export const GoiNS = "3bebe461-2f53-419c-b7b7-e626f9ce0a6b"
