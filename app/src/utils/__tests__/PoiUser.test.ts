import Base32Decode from "base32-decode"

Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: jest.fn(),
  },
})

import * as PoiUser from "../PoiUser"

describe("PoiUser", () => {
  test("PoiUserId starts with timestamp", async () => {
    const testPoiUserId = await PoiUser.GenerateId()
    const raw = Buffer.from(
      Base32Decode(testPoiUserId.toUpperCase(), "RFC4648")
    )
    const userTimeStamp = Number(raw.readBigUInt64LE())
    const nowTimeStamp = new Date().getTime()
    expect(userTimeStamp).toBeLessThanOrEqual(nowTimeStamp)
    expect(userTimeStamp).toBeGreaterThanOrEqual(nowTimeStamp - 600)
  })
})
