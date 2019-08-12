import { SeedUserAndSaving, CreateStore } from "../../testing/GoiTesting"
import { GoiDb } from "../../utils/GoiDb"

import * as GoiSaving from "../GoiSaving"

describe("GoiSaving", () => {
  beforeAll(async () => {
    GoiDb({ test: true })
  })

  describe("GoiWordHistoryModel", () => {
    test("Create", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
    })
  })
  describe("GoiWordRecordModel", () => {
    test("Create", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
    })
  })
  describe("GoiSavingModel", () => {
    test("Succeed", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
    })
  })
  describe("BulkHelpers", () => {
    describe("BulkCreate", () => {
      test("SingleSucceed", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const bulkCreateResults = await GoiSaving.BulkCreateWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["SingleSucceed"] }
        )
        const record = await GoiSaving.GoiWordRecord(
          poiUserId,
          savingId,
          "SingleSucceed"
        ).Read()
        expect(record.WordKey).toBe("SingleSucceed")
        expect(bulkCreateResults).toStrictEqual(["SingleSucceed"])
      })
      test("SingleAttached", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const bulkCreateResults = await GoiSaving.BulkCreateWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["SingleAttached"] }
        )
        const record = await GoiSaving.GoiWordRecord(
          poiUserId,
          savingId,
          "SingleAttached"
        ).Read()
        const saving = await GoiSaving.GoiSaving(poiUserId, savingId).Read()
        expect(saving.Records).toMatchObject({
          SingleAttached: GoiSaving.GoiWordRecordModel.GetDbKey(
            poiUserId,
            savingId,
            "SingleAttached"
          ),
        })
      })
      test("MultipleSucceed", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const bulkCreateResults = await GoiSaving.BulkCreateWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["MultipleSucceed", "AnotherKeyForMultipleSucceed"] }
        )
        const record = await GoiSaving.GoiWordRecord(
          poiUserId,
          savingId,
          "MultipleSucceed"
        ).Read()
        expect(record.WordKey).toBe("MultipleSucceed")
        expect(bulkCreateResults).toStrictEqual([
          "MultipleSucceed",
          "AnotherKeyForMultipleSucceed",
        ])
      })
    })
    describe("BulkGetOrCreate", () => {
      test("SingleGetSucceed", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const record = await GoiSaving.GoiWordRecord(
          poiUserId,
          savingId,
          "SingleGetSucceed"
        ).Create()
        const bulkGetResults = await GoiSaving.BulkGetWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["SingleGetSucceed"] }
        )
        expect(Object.keys(bulkGetResults)).toContain("SingleGetSucceed")
        expect(Object.keys(bulkGetResults["SingleGetSucceed"])).toContain(
          "WordKey"
        )
        expect(bulkGetResults["SingleGetSucceed"]["WordKey"]).toBe(
          "SingleGetSucceed"
        )
      })
      test("CreateMissingKey", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const bulkGetResults = await GoiSaving.BulkGetWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["SingleMissingKey"] }
        )
        expect(Object.keys(bulkGetResults)).toContain("SingleMissingKey")
        expect(Object.keys(bulkGetResults["SingleMissingKey"])).toContain(
          "WordKey"
        )
        expect(bulkGetResults["SingleMissingKey"]["WordKey"]).toBe(
          "SingleMissingKey"
        )
      })
      test("CombineMissingKey", async () => {
        const { poiUserId, savingId } = await SeedUserAndSaving()
        const record = await GoiSaving.GoiWordRecord(
          poiUserId,
          savingId,
          "FirstCreatedKey"
        ).Create()
        const bulkGetResults = await GoiSaving.BulkGetWordRecords(
          { poiUserId, savingId },
          { wordKeys: ["FirstCreatedKey", "SecondMissingKey"] }
        )
        expect(Object.keys(bulkGetResults)).toContain("FirstCreatedKey")
        expect(Object.keys(bulkGetResults)).toContain("SecondMissingKey")
        expect(bulkGetResults["FirstCreatedKey"]["WordKey"]).toBe(
          "FirstCreatedKey"
        )
        expect(bulkGetResults["SecondMissingKey"]["WordKey"]).toBe(
          "SecondMissingKey"
        )
      })
    })
    test("Succeed", async () => {
      const { poiUserId, savingId } = await SeedUserAndSaving()
    })
  })
})
