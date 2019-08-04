import "../../testing/GoiTesting"
import uuid5 from "uuid/v5"
import { DbKey } from "../PoiDb"

import * as GoiDb from "../GoiDb"

describe("GoiDb", () => {
  beforeAll(async () => {
    GoiDb.GoiDb({ test: true })
  })

  test("GoiDb is singleton", async () => {
    const db1 = GoiDb.GoiDb()
    const db2 = GoiDb.GoiDb()
    expect(db1).toEqual(db2)
  })
  describe("Exists", () => {
    test("Missing: Missing doc returns false", async () => {
      const result = await GoiDb.GoiDb().Exists("GoiDb/Exists/Missing" as DbKey)
      expect(result).toBe(false)
    })
    test("Hit: Existing doc returns true", async () => {
      GoiDb.GoiDb().put({ _id: "GoiDb/Exists/Hit", content: "Hit" })
      const result = await GoiDb.GoiDb().Exists("GoiDb/Exists/Hit" as DbKey)
      expect(result).toBe(true)
    })
  })
  describe("Get", () => {
    test("Missing: Missing doc throw error", async () => {
      await expect(
        GoiDb.GoiDb().Get("GoiDb/Get/Missing" as DbKey)
      ).rejects.toThrow()
    })
    test("Hit: Existing doc returns doc", async () => {
      GoiDb.GoiDb().put({
        _id: "GoiDb/Get/Hit",
        l1: {
          l2: "GoiDb/Get/Hit/Content",
        },
      })
      const result = await GoiDb.GoiDb().Get("GoiDb/Get/Hit" as DbKey)
      expect(result).toMatchObject({
        _id: "GoiDb/Get/Hit",
        l1: {
          l2: "GoiDb/Get/Hit/Content",
        },
      })
    })
  })
  describe("GoiNS", () => {
    test("StaticNS: GoiNS cannot change", async () => {
      const staticGoiNS = "3bebe461-2f53-419c-b7b7-e626f9ce0a6b"
      expect(GoiDb.GoiNS).toBe(staticGoiNS)
    })
    test("StaticUuid: Uuid must be stable hash", async () => {
      const testUuid = uuid5("GoiDb/GoiNS/StaticUuid", GoiDb.GoiNS)
      expect(testUuid).toBe("bdb1f214-85ad-50fc-a12c-3b1d4d78e658")
    })
  })
})
