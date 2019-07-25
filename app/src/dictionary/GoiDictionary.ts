type JA_POS = "KANA" | "NOUN" | "VERB_GODAN_JIDOSHI"
type POS = "POS" | any
type EN_POS = "NOUN" | "VERB"
export interface GoiWordType {
  common: string
  audio: {
    cv: string
    wav: string
  }[]
  pos: POS
  translation: {
    from: string
    translation: { en?: string; zh?: string; ja?: string }
    hint?: { en?: string; zh?: string; ja?: string }
  }[]
  sentences?: {
    from: string
    sentence: string
    audio?: { cv: string; wav: string }[]
    translation?: { zh?: string }
    source?: string
    link?: string
    contributor?: string
  }[]
  links?: { [s: string]: string }
  textbook: string[]
}
export interface GoiEnWordType extends GoiWordType {
  // common:
  // audio:
  pos: EN_POS
  // translation:
}
export interface GoiJaWordType extends GoiWordType {
  // common:
  alternatives: string[]
  uncommon: string[]
  kana: string
  romaji: string // 修正ヘボン式
  wapuro: string // ワープロローマ字
  // audio:
  pos: JA_POS
  // translation:
  katsuyo?: {
    // 活用
    keigo: string // 敬語
  }
}
export interface GoiDictionaryMetadataType {
  name: { zh: string }
  description: { zh: string }
  scheme: number
}
export interface GoiJaDictionaryType extends GoiDictionaryMetadataType {
  words: { [s: string]: GoiJaWordType }
}
