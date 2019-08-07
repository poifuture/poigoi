export type POS = "POS" | string | string[]
export type EN_POS = "NOUN" | "VERB"
export type JA_BASIC_POS =
  | "HIRAGANA"
  | "KATAKANA"
  | "KANA"
  | "NOUN"
  | "VERB"
  | "GODAN"
  | "JIDOSHI"
  | "TADOSHI"
export type JA_POS = JA_BASIC_POS | JA_BASIC_POS[]
export type JA_TONE = number | number[]
export type I18nString = { en?: string; zh?: string; ja?: string }
export type LanguageCode =
  | "ja-c2" // Chunibyo
  | "zh-c2" // Chunibyo
  | "en"
  | "en-us"
  | "ja"
  | "ja-jp"
  | "zh"
  | "zh-cn"
export interface GoiWordType {
  key: string
  language: LanguageCode
  common: string
  audios: {
    cv: string
    wav: string
  }[]
  pos: POS
  translations: {
    [from: string]: {
      translation: I18nString
      hint?: I18nString
    }
  }
  sentences?: {
    from: string
    sentence: string
    audios?: { cv: string; wav: string }[]
    translation?: I18nString
    source?: string
    link?: string
    contributor?: string
  }[]
  links?: { [s: string]: string }
  textbook: string[]
}
export interface GoiEnWordType extends GoiWordType {
  language: "en"
  // common:
  // audio:
  pos: EN_POS
  // translation:
}
export interface GoiJaWordType extends GoiWordType {
  language: "ja"
  // common:
  alternatives: string[]
  uncommons: string[]
  kana: string
  romaji: string // 修正ヘボン式
  wapuro: string // ワープロローマ字
  // audio:
  pos: JA_POS
  // translation:
  tone?: JA_TONE
  katsuyo?: {
    // 活用
    keigo: string // 敬語
  }
}
export interface GoiDictionaryMetadataType {
  name: string
  language: LanguageCode
  display: I18nString
  description: I18nString
  schema: "Poi/Goi/RawDictionary/v1" | "Poi/Goi/RawDictionary/ja/v1"
  extends?: {
    name: string
    display: I18nString
    description: I18nString
  }[]
}
export interface GoiJaDictionaryType extends GoiDictionaryMetadataType {
  language: "ja" | "ja-jp" | "ja-c2"
  schema: "Poi/Goi/RawDictionary/ja/v1"
  words: { [s: string]: GoiJaWordType }
}
