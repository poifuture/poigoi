import { LocaleCode, I18nString } from "../types/PoiI18nTypes"

export const LookUp = (i18nString: I18nString, locale: LocaleCode) => {
  // TODO(nagi): Write better lookup
  if (locale.startsWith("zh")) {
    if (i18nString.zh) {
      return i18nString.zh
    }
  }
  if (locale.startsWith("ja")) {
    if (i18nString.ja) {
      return i18nString.ja
    }
  }
  return i18nString.en || ""
}
