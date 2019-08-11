import i18next from "i18next"
import * as GoiI18n from "../GoiI18n"

const TestI18nOptions = {
  load: "currentOnly" as const,
  lowerCaseLng: true,
  debug: true,
}

describe("GoiI18n", () => {
  describe("GoiI18nHit", () => {
    test("C2Hit: zh-hans-c2", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            "zh-hans-c2": {
              translation: {
                teststr: "zh-hans-c2-teststr",
              },
            },
          },
          lng: "zh-hans-c2",
        },
        () => {
          expect(i18next.t("teststr")).toBe("zh-hans-c2-teststr")
        }
      )
    })
  })
  describe("GoiI18nFallbacks", () => {
    test("DefaultFallback: en-gb -> en", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            en: {
              translation: {
                teststr: "en-teststr",
              },
            },
            "en-gb": {
              translation: {
                teststr: "en-gb-teststr",
              },
            },
          },
          lng: "en-gb",
          fallbackLng: {
            "en-gb": ["en"],
            zh: ["en"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("en-gb-teststr")
          expect(i18next.t("teststr", { lng: "en" })).toBe("en-teststr")
          expect(i18next.t("teststr", { lng: "zh" })).toBe("en-teststr")
        }
      )
    })
    test("Chu2Fallback: en-c2 -> en", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            en: {
              translation: {
                teststr: "en-teststr",
              },
            },
            "en-c2": {
              translation: {
                teststr: "en-c2-teststr",
              },
            },
          },
          lng: "en-c2",
          fallbackLng: {
            "en-c2": ["en"],
            zh: ["en"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("en-c2-teststr")
          expect(i18next.t("teststr", { lng: "en" })).toBe("en-teststr")
          expect(i18next.t("teststr", { lng: "zh" })).toBe("en-teststr")
        }
      )
    })
    test("HorizonFallback: en-c2 -> en-us", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            en: {
              translation: {
                teststr: "en-teststr",
              },
            },
            "en-us": {
              translation: {
                teststr: "en-us-teststr",
              },
            },
          },
          lng: "en-c2",
          fallbackLng: {
            "en-us": ["en"],
            "en-c2": ["en-us", "en"],
            zh: ["en"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("en-us-teststr")
          expect(i18next.t("teststr", { lng: "en" })).toBe("en-teststr")
          expect(i18next.t("teststr", { lng: "zh" })).toBe("en-teststr")
        }
      )
    })
    test("ScriptFallback: zh-hans-cn -> zh-hans", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            zh: {
              translation: {
                teststr: "zh-teststr",
              },
            },
            "zh-hans": {
              translation: {
                teststr: "zh-hans-teststr",
              },
            },
          },
          lng: "zh-hans-cn",
          fallbackLng: {
            "zh-hans": ["zh"],
            "zh-hans-cn": ["zh-hans"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("zh-hans-teststr")
          expect(i18next.t("teststr", { lng: "zh-hans-cn" })).toBe(
            "zh-hans-teststr"
          )
          expect(i18next.t("teststr", { lng: "zh-hans" })).toBe(
            "zh-hans-teststr"
          )
          expect(i18next.t("teststr", { lng: "zh" })).toBe("zh-teststr")
        }
      )
    })
    test("ScriptC2Fallback: zh-hans-c2 -> zh-hans-cn/zh-hans", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            zh: {
              translation: {
                teststr: "zh-teststr",
              },
            },
            "zh-hans": {
              translation: {
                teststr: "zh-hans-teststr",
                teststr2: "zh-hans-teststr2",
              },
            },
            "zh-hans-cn": {
              translation: {
                teststr: "zh-hans-cn-teststr",
              },
            },
          },
          lng: "zh-hans-c2",
          fallbackLng: {
            "zh-hans": ["zh"],
            "zh-hans-cn": ["zh-hans", "zh"],
            "zh-hans-c2": ["zh-hans-cn", "zh-hans", "zh"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("zh-hans-cn-teststr")
          expect(i18next.t("teststr2")).toBe("zh-hans-teststr2")
        }
      )
    })
    test("AliasFallback: zh-cn -> zh-hans", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            zh: {
              translation: {
                teststr: "zh-teststr",
              },
            },
            "zh-hans": {
              translation: {
                teststr: "zh-hans-teststr",
              },
            },
          },
          lng: "zh-cn",
          fallbackLng: {
            "zh-hans": ["zh"],
            "zh-hans-cn": ["zh-hans"],
            "zh-cn": ["zh-hans-cn", "zh-hans", "zh"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("zh-hans-teststr")
        }
      )
    })
    test("AliasC2Fallback: zh-c2 -> zh-hans-c2", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            zh: {
              translation: {
                teststr: "zh-teststr",
              },
            },
            "zh-hans": {
              translation: {
                teststr: "zh-hans-teststr",
                teststr3: "zh-hans-teststr3",
              },
            },
            "zh-hans-cn": {
              translation: {
                teststr: "zh-hans-cn-teststr",
                teststr2: "zh-hans-cn-teststr2",
              },
            },
            "zh-hans-c2": {
              translation: {
                teststr: "zh-hans-c2-teststr",
              },
            },
          },
          lng: "zh-c2",
          fallbackLng: {
            "zh-hans": ["zh"],
            "zh-hans-cn": ["zh-hans", "zh"],
            "zh-hans-c2": ["zh-hans-cn", "zh-hans", "zh"],
            "zh-c2": ["zh-hans-c2", "zh-hans-cn", "zh-hans", "zh"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("zh-hans-c2-teststr")
          expect(i18next.t("teststr2")).toBe("zh-hans-cn-teststr2")
          expect(i18next.t("teststr3")).toBe("zh-hans-teststr3")
        }
      )
    })
  })
  describe("Unsupported", () => {
    test("ChainedFallback: zh-hans-c2", async () => {
      i18next.init(
        {
          ...TestI18nOptions,
          resources: {
            zh: {
              translation: {
                teststr: "zh-teststr",
              },
            },
            "zh-hans": {
              translation: {
                teststr: "zh-hans-teststr",
              },
            },
          },
          lng: "zh-hans-c2",
          fallbackLng: {
            "zh-hans": ["zh"],
            "zh-hans-cn": ["zh-hans"],
            "zh-hans-c2": ["zh-hans-cn"],
          },
        },
        () => {
          expect(i18next.t("teststr")).toBe("teststr")
          expect(i18next.t("teststr", { lng: "zh-hans-cn" })).toBe(
            "zh-hans-teststr"
          )
        }
      )
    })
  })
})
