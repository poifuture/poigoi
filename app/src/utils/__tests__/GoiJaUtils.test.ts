import "../../testing/GoiTesting"

import * as GoiJaUtils from "../GoiJaUtils"

describe("GoiJaUtils", () => {
  describe("TrimFurigana", () => {
    test("Succeed: Trim au", () => {
      expect(GoiJaUtils.TrimFurigana("<ruby>会<rt>あ</rt></ruby>う")).toBe(
        "会う"
      )
    })
    test("NonGreedy: Trim tokyo", () => {
      expect(
        GoiJaUtils.TrimFurigana(
          "<ruby>東<rt>とう</rt></ruby><ruby>京<rt>きょう</rt></ruby>"
        )
      ).toBe("東京")
    })
    test("TrimOkurigana", () => {
      expect(
        GoiJaUtils.TrimFurigana(
          "<ruby>申<rt>もう<ins>し</ins></rt></ruby><ruby>込<rt>こ<ins>み</ins></rt></ruby><ruby>書<rt>しょ</rt></ruby>"
        )
      ).toBe("申込書")
    })
  })
  describe("AsciiRomaji", () => {
    test("Succeed: Tokyo", () => {
      expect(GoiJaUtils.AsciiRomaji("Tōkyō")).toBe("Tokyo")
    })
    test("AllChoonpu", () => {
      expect(GoiJaUtils.AsciiRomaji("āĀīĪūŪēĒōŌ")).toBe("aAiIuUeEoO")
    })
    test("AllChoonpuRepeat", () => {
      expect(
        GoiJaUtils.AsciiRomaji("aAiIuUeEoOāĀīĪūŪēĒōŌōŌēĒūŪīĪāĀoOeEuUiIaA")
      ).toBe("aAiIuUeEoOaAiIuUeEoOoOeEuUiIaAoOeEuUiIaA")
    })
  })
})
