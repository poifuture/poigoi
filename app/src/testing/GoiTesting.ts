// Polyfill nodejs environment
import PouchDB from "pouchdb"
import PouchDBAdapterMemory from "pouchdb-adapter-memory"
PouchDB.plugin(PouchDBAdapterMemory)
jest.mock("pouchdb-browser", () => PouchDB)
import crypto from "crypto"
Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: (array: Uint32Array) => crypto.randomFillSync(array),
  },
})

import * as PoiUser from "../utils/PoiUser"
import { GoiUser } from "../models/GoiUser"
import { createStore, applyMiddleware, Store } from "redux"
import RootReducer from "../reducers/RootReducer"
import ReduxThunk from "redux-thunk"
import DebugModule from "debug"
import { TestingInitUserAction } from "../actions/GoiUserActions"
import { LazyInitSavingAction } from "../actions/GoiSavingActions"
const debug = DebugModule("PoiGoi:GoiTesting")

export const SeedUserAndSaving = async (store?: Store) => {
  const poiUserId: PoiUser.PoiUserId = await PoiUser.GenerateId()
  await GoiUser(poiUserId).Create()
  const savingId = await GoiUser(poiUserId).getDefaultSaving()
  debug("Seeding user and saving...", poiUserId, savingId)
  if (typeof store !== "undefined") {
    store.dispatch(TestingInitUserAction({ poiUserId }) as any)
    store.dispatch(LazyInitSavingAction({ poiUserId }) as any)
  }
  return { poiUserId, savingId }
}

export const CreateStore = () => {
  return createStore(RootReducer, applyMiddleware(ReduxThunk))
}
