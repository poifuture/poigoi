import { LanguageCode } from "./PoiI18nTypes"

export type POS = "POS" | string | string[]
export type EN_POS = "LETTER" | "NOUN" | "VERB"
// https://ja.wikipedia.org/wiki/%E5%93%81%E8%A9%9E
export type JA_BASIC_POS =  // 品詞
  | "KANA" //仮名
  | "HIRAGANA" //平仮名
  | "KATAKANA" //片仮名
  | "DAKUON" //濁音
  | "YOON" //拗音
  | "CHOON" //長音
  | "VERB" //動詞
  | "GODAN" //五段
  | "KAMIICHIDAN" //上一段
  | "SHIMOICHIDAN" //下一段
  | "SAHEN" //サ変
  | "KAHEN" //カ変
  | "JIDOSHI" //自動詞
  | "TADOSHI" //他動詞
  | "ADJ" //形容詞
  | "KEIYODOSHI" //形容動詞
  | "NOUN" //名詞
  | "PROPER" //固有名詞
  | "PRON" //代名詞
  | "RENTAISHI" //連体詞
  | "ADV" //副詞
  | "CONJ" //接続詞
  | "INTERJ" //感動詞
  | "JODOSHI" //助動詞
  | "JOSHI" //助詞
  | "IDIOM" //熟語
export type JA_POS = JA_BASIC_POS | JA_BASIC_POS[]
export type JA_TONE = number | number[]
export type I18nString = { en?: string; zh?: string; ja?: string }
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
  tone?: JA_TONE | "?"
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
