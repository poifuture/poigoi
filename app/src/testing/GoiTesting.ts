// Polyfill nodejs environment
import PouchDB from "pouchdb"
import PouchDBAdapterMemory from "pouchdb-adapter-memory"
PouchDB.plugin(PouchDBAdapterMemory)
jest.mock("pouchdb-browser", () => PouchDB)
import crypto from "crypto"
Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: (array: Uint32Array) => crypto.randomBytes(array.length),
  },
})

import * as PoiUser from "../utils/PoiUser"
import { GoiUser } from "../models/GoiUser"
import { createStore, applyMiddleware } from "redux"
import RootReducer from "../reducers/RootReducer"
import ReduxThunk from "redux-thunk"

export const SeedUserAndSaving = async () => {
  const poiUserId: PoiUser.PoiUserId = await PoiUser.GenerateId()
  await GoiUser(poiUserId).Create()
  const savingId = await GoiUser(poiUserId).getDefaultSaving()
  return { poiUserId, savingId }
}

export const CreateStore = () => {
  return createStore(RootReducer, applyMiddleware(ReduxThunk))
}
