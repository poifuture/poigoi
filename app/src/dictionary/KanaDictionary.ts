import { GoiJaDictionaryType } from "./GoiDictionary"

export const KanaDictionary: GoiJaDictionaryType = {
  name: { zh: "假名词典" },
  description: {
    zh: "假名词典",
  },
  scheme: 1,
  words: {
    あ: {
      common: "<ruby>あ<rt>a</rt></ruby>",
      alternatives: [],
      uncommon: [],
      kana: "あ",
      romaji: "a",
      wapuro: "a",
      audio: [{ cv: "Hikari", wav: "" }],
      pos: "KANA",
      translation: [
        {
          from: "KanaDictionary",
          translation: { ja: "あ" },
          hint: {
            ja: "安；<ruby>愛<rt>あい</rt></ruby>",
          },
        },
      ],
      textbook: ["KANA-HIRAGANA-00001"],
    },
    い: {
      common: "<ruby>い<rt>i</rt></ruby>",
      alternatives: [],
      uncommon: [],
      kana: "い",
      romaji: "i",
      wapuro: "i",
      audio: [{ cv: "Hikari", wav: "" }],
      pos: "KANA",
      translation: [
        {
          from: "KanaDictionary",
          translation: { ja: "い" },
          hint: {
            ja: "以；<ruby>家<rt>いえ</rt></ruby>",
          },
        },
      ],
      textbook: ["KANA-HIRAGANA-00002"],
    },
  },
}

export default KanaDictionary
