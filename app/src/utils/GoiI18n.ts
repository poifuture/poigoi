import i18n from "i18next"
import Backend from "i18next-xhr-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import ZhCommandsBarLocale from "../locales/zh/CommandsBar.json"
import ZhGoiTesterLocale from "../locales/zh/GoiTester.json"
import ZhLandingPageLocale from "../locales/zh/LandingPage.json"
import ZhWordAdderLocale from "../locales/zh/WordAdder.json"
import ZhHansLandingPageLocale from "../locales/zh-hans/LandingPage.json"
import ZhHansC2LandingPageLocale from "../locales/zh-hans-c2/LandingPage.json"
import ZhHansC2CommandsBarLocale from "../locales/zh-hans-c2/CommandsBar.json"

const resources = {
  zh: {
    CommandsBar: ZhCommandsBarLocale,
    GoiTester: ZhGoiTesterLocale,
    LandingPage: ZhLandingPageLocale,
    WordAdder: ZhWordAdderLocale,
  },
  "zh-hans": {
    LandingPage: ZhHansLandingPageLocale,
  },
  "zh-hans-c2": {
    CommandsBar: ZhHansC2CommandsBarLocale,
    LandingPage: ZhHansC2LandingPageLocale,
  },
}
console.log(resources)

i18n
  // .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      default: ["en"],
      "en-us": ["en"],
      "en-c2": ["en-us", "en"],
      zh: ["en"],
      "zh-hans": ["zh", "en"],
      "zh-hans-cn": ["zh-hans", "zh", "en"],
      "zh-hans-c2": ["zh-hans-cn", "zh-hans", "zh", "en"],
      "zh-hant": ["zh", "en"],
      "zh-hant-tw": ["zh-hant", "zh", "en"],
      "zh-hant-c2": ["zh-hant-tw", "zh-hant", "zh", "en"],
      "zh-cn": ["zh-hans-cn", "zh-hans", "zh", "en"],
      "zh-c2": ["zh-hans-c2", "zh-hans-cn", "zh-hans", "zh", "en"],
      ja: ["en"],
      "ja-jpan": ["ja", "en"],
      "ja-jpan-jp": ["ja-jpan", "ja", "en"],
      "ja-jpan-c2": ["ja-jpan-jp", "ja-jpan", "ja", "en"],
      "ja-jp": ["ja-jpan-jp", "ja-jpan", "ja", "en"],
      "ja-c2": ["ja-jpan-c2", "ja-jpan-jp", "ja-jpan", "ja", "en"],
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "locale",
      caches: ["localStorage"],
    },
    load: "currentOnly",
    lowerCaseLng: true,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      wait: true,
    },
  })
export default i18n
