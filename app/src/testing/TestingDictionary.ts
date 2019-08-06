import { GoiJaDictionaryType } from "../types/GoiDictionaryTypes"

export const TestingDictionary: GoiJaDictionaryType = {
  name: "TestingDictionary",
  language: "ja",
  display: { zh: "测试词典" },
  description: {
    zh: "一个用来喂测试的词典",
  },
  schema: "Poi/Goi/RawDictionary/v1",
  words: {
    会う: {
      key: "会う",
      language: "ja",
      common: "<ruby>会<rt>あ</rt></ruby>う",
      alternatives: ["<ruby>逢<rt>あ</rt></ruby>う"],
      uncommons: [
        "<ruby>遭<rt>あ</rt></ruby>う",
        "<ruby>遇<rt>あ</rt></ruby>う",
      ],
      kana: "あう",
      romaji: "au",
      wapuro: "au",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: ["VERB", "GODAN", "JIDOSHI"],
      translations: {
        TestingDictionary: {
          translation: { zh: "见" },
          hint: {
            zh:
              "【同训异字】<ruby>会<rt>あ</rt></ruby>う：见到人或事；<ruby>逢<rt>あ</rt></ruby>う：相逢爱人；<ruby>遭<rt>あ</rt></ruby>う：遭遇坏事；<ruby>遇<rt>あ</rt></ruby>う：遇见意外",
          },
        },
      },
      katsuyo: {
        keigo: "<ruby>会<rt>あ</rt></ruby>います",
      },
      sentences: [
        {
          from: "AnimeSong",
          sentence:
            "ねぇ、<ruby>今<rt>いま</rt></ruby>すぐ<ruby>会<rt>あ</rt></ruby>いたいよ",
          audios: [{ cv: "Hikari", wav: "" }],
          translation: { zh: "现在好想快点见到你啊" },
          source: "GUMI『会いたい』",
          link: "https://www.nicovideo.jp/watch/sm11713594",
          contributor: "凪",
        },
      ],
      links: {
        JishoOrg: "https://jisho.org/word/%E4%BC%9A%E3%81%86",
        goo: "https://dictionary.goo.ne.jp/jn/1436/meaning/m0u/",
      },
      textbook: ["JLPT-N5-00001", "XINBIAN-01-01-0001"],
    },
    ご馳走さま: {
      key: "ご馳走さま",
      language: "ja",
      common: "ご<ruby>馳<rt>ち</rt></ruby><ruby>走<rt>そう</rt></ruby>さま",
      alternatives: [
        "ご<ruby>馳<rt>ち</rt></ruby><ruby>走<rt>そう</rt></ruby><ruby>様<rt></rt>さま</ruby>",
      ],
      uncommons: [
        "<ruby>御<rt>ご</rt></ruby><ruby>馳<rt>ち</rt></ruby><ruby>走<rt>そう</rt></ruby><ruby>様<rt>さま</rt></ruby>",
      ],
      kana: "ごちそうさま",
      romaji: "gochisōsama",
      wapuro: "gochisousama",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: "NOUN",
      translations: {
        TestingDictionary: { translation: { zh: "谢谢款待" } },
      },
      sentences: [],
      links: {},
      textbook: [],
    },
    東京: {
      key: "東京",
      language: "ja",
      common: "<ruby>東<rt>とう</rt></ruby><ruby>京<rt>きょう</rt></ruby>",
      alternatives: [],
      uncommons: [],
      kana: "とうきょう",
      romaji: "Tōkyō",
      wapuro: "toukyou",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: "NOUN",
      translations: {
        TestingDictionary: { translation: { zh: "东京" } },
      },
      sentences: [],
      links: {},
      textbook: [],
    },
  },
}

export default TestingDictionary
