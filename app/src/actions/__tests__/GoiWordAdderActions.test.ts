import { SeedUserAndSaving, CreateStore } from "../../testing/GoiTesting"
import { GoiDb } from "../../utils/GoiDb"
import {
  GoiWordRecord,
  GoiSaving,
  BulkGetWordRecords,
} from "../../models/GoiSaving"

import * as WordAdderActions from "../WordAdderActions"

describe("WordAdderActions", () => {
  beforeAll(async () => {
    GoiDb({ test: true })
  })

  describe("AddPendingQueryAction", () => {
    test("Succeed", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
      const store = CreateStore()
      await store.dispatch(WordAdderActions.AddPendingQueryAction(
        {
          display: { en: "WordAdderActions/AddPendingQueryAction/Succeed" },
          query: "KATAKANA-0000[123]",
        },
        { poiUserId, savingId }
      ) as any)
      expect(
        store
          .getState()
          .WordAdder.get("Pendings")
          .toJS()
      ).toContainEqual({
        Display: { en: "WordAdderActions/AddPendingQueryAction/Succeed" },
        Query: "KATAKANA-0000[123]",
      })
    })
  })

  describe("AddWordsFromQuerysAction", () => {
    test("Succeed", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
      const store = CreateStore()
      await store.dispatch(WordAdderActions.AddWordsFromQuerysAction(
        { querys: ["KATAKANA.*0000[12]", "KATAKANA.*0000[34]"] },
        { poiUserId, savingId }
      ) as any)
      expect(
        (await GoiWordRecord(poiUserId, savingId, "ア").Read()).Pending
      ).toContain("-00000-")
      expect(
        (await GoiWordRecord(poiUserId, savingId, "エ").Read()).Pending
      ).toContain("-00001-")
      const wordKeys = Object.keys(
        await BulkGetWordRecords({ poiUserId, savingId })
      )
      expect(wordKeys).toContain("ア")
      expect(wordKeys).toContain("イ")
      expect(wordKeys).toContain("ウ")
      expect(wordKeys).toContain("エ")
    })

    test("Passive: Doesn't touch learned or prioritied words", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
      const store = CreateStore()
      await GoiWordRecord(poiUserId, savingId, "ア").Create()
      await GoiWordRecord(poiUserId, savingId, "ア").SetLevel(5)
      await GoiWordRecord(poiUserId, savingId, "イ").Create()
      await GoiWordRecord(poiUserId, savingId, "イ").SetPrioritied(
        "AddWordsFromQuerysAction/Passive/Prioritied"
      )
      await GoiWordRecord(poiUserId, savingId, "ウ").Create()
      await GoiWordRecord(poiUserId, savingId, "ウ").SetPending(
        "AddWordsFromQuerysAction/Passive/Pending"
      )
      await GoiSaving(poiUserId, savingId).AttachRecords(["ア", "イ", "ウ"])
      await store.dispatch(WordAdderActions.AddWordsFromQuerysAction(
        { querys: ["KATAKANA.*0000[1234]"] },
        { poiUserId, savingId }
      ) as any)
      const recordA = await GoiWordRecord(poiUserId, savingId, "ア").Read()
      expect(recordA.Level).toBe(5)
      expect(recordA.Pending).toBe("")
      const recordI = await GoiWordRecord(poiUserId, savingId, "イ").Read()
      expect(recordI.Prioritied).toBe(
        "AddWordsFromQuerysAction/Passive/Prioritied"
      )
      expect(recordI.Pending).toBe("")
      const recordU = await GoiWordRecord(poiUserId, savingId, "ウ").Read()
      expect(recordU.Pending).toBe("AddWordsFromQuerysAction/Passive/Pending")
      expect(
        (await GoiWordRecord(poiUserId, savingId, "エ").Read()).Pending
      ).toContain("-00000-")
      const wordKeys = Object.keys(
        await BulkGetWordRecords({ poiUserId, savingId })
      )
      expect(wordKeys).toContain("ア")
      expect(wordKeys).toContain("イ")
      expect(wordKeys).toContain("ウ")
      expect(wordKeys).toContain("エ")
    })
  })
  describe("ClearPendingWordsAction", () => {
    test("Succeed", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
      const store = CreateStore()
      await GoiWordRecord(poiUserId, savingId, "ア").Create()
      await GoiWordRecord(poiUserId, savingId, "ア").SetPending(
        "ClearPendingWordsAction/Passive/Pending"
      )
      await GoiSaving(poiUserId, savingId).AttachRecords(["ア"])
      expect(
        (await GoiWordRecord(poiUserId, savingId, "ア").Read()).Pending
      ).toBe("ClearPendingWordsAction/Passive/Pending")
      await store.dispatch(WordAdderActions.ClearPendingWordsAction({
        poiUserId,
        savingId,
      }) as any)
      expect(
        (await GoiWordRecord(poiUserId, savingId, "ア").Read()).Pending
      ).toBe("")
    })
    test("Passive: Doesn't touch learned or prioritied words", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
      const store = CreateStore()
      await GoiWordRecord(poiUserId, savingId, "ア").Create()
      await GoiWordRecord(poiUserId, savingId, "ア").SetLevel(5)
      await GoiWordRecord(poiUserId, savingId, "イ").Create()
      await GoiWordRecord(poiUserId, savingId, "イ").SetPrioritied(
        "ClearPendingWordsAction/Passive/Prioritied"
      )
      await GoiWordRecord(poiUserId, savingId, "ウ").Create()
      await GoiWordRecord(poiUserId, savingId, "ウ").SetPending(
        "ClearPendingWordsAction/Passive/Pending"
      )
      await GoiSaving(poiUserId, savingId).AttachRecords(["ア", "イ", "ウ"])
      await store.dispatch(WordAdderActions.ClearPendingWordsAction({
        poiUserId,
        savingId,
      }) as any)
      const recordA = await GoiWordRecord(poiUserId, savingId, "ア").Read()
      expect(recordA.Level).toBe(5)
      const recordI = await GoiWordRecord(poiUserId, savingId, "イ").Read()
      expect(recordI.Prioritied).toBe(
        "ClearPendingWordsAction/Passive/Prioritied"
      )
      const recordU = await GoiWordRecord(poiUserId, savingId, "ウ").Read()
      expect(recordU.Pending).toBe("")
      const wordKeys = Object.keys(
        await BulkGetWordRecords({ poiUserId, savingId })
      )
      expect(wordKeys).toContain("ア")
      expect(wordKeys).toContain("イ")
    })
  })
})
