import i18n from "i18next"
import Backend from "i18next-xhr-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import ZhLandingPageLocale from "../locales/zh/LandingPage.json"
import ZhCommandsBarLocale from "../locales/zh/CommandsBar.json"
import ZhHansLandingPageLocale from "../locales/zh-hans/LandingPage.json"

const resources = {
  zh: {
    LandingPage: ZhLandingPageLocale,
    CommandsBar: ZhCommandsBarLocale,
  },
  "zh-hans": {
    LandingPage: ZhHansLandingPageLocale,
  },
}

i18n
  // .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      default: ["en"],
      "en-us": ["en"],
      zh: ["en"],
      "zh-hans": ["zh", "en"],
      "zh-hans-cn": ["zh-hans", "zh", "en"],
      "zh-hans-c2": ["zh-hans", "zh", "en"],
      "zh-hant": ["zh", "en"],
      "zh-hant-tw": ["zh-hant", "zh", "en"],
      "zh-cn": ["zh-hans-cn", "zh-hans", "zh", "en"],
      ja: ["en"],
      "ja-jpan": ["ja", "en"],
      "ja-jpan-jp": ["ja-jpan", "ja", "en"],
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "locale",
      caches: ["localStorage"],
    },
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
