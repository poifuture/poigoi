import { GoiJaDictionaryType } from "../types/GoiDictionaryTypes"
// https://prowriters.jp/grammar/verb

export const GoiSimpleJaDictionary: GoiJaDictionaryType = {
  name: "GoiSimpleJaDictionary",
  language: "ja",
  display: { zh: "速记词典" },
  description: {
    zh:
      "中文释义采用日常使用该词汇时的直观释义，强化实际运用日语时的概念感受，提升日常会话交流的反应速度，弱化语言学的精准定义，推荐以听、说为主要目的同学使用。",
  },
  schema: "Poi/Goi/RawDictionary/v1",
  extends: [
    {
      name: "Xinbian",
      display: { zh: "新编日语" },
      description: { zh: "新编日语" },
    },
  ],
  words: {
    会う: {
      key: "会う",
      language: "ja",
      common: "<ruby>会<rt>あ</rt></ruby>う",
      alternatives: ["あう"],
      uncommons: [],
      kana: "あう",
      romaji: "au",
      wapuro: "au",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: ["VERB", "GODAN", "JIDOSHI"],
      tone: 1,
      translations: {
        GoiSimpleJaDictionary: {
          translation: { zh: "见" },
          hint: {
            zh:
              "【同训异字】<ruby>会<rt>あ</rt></ruby>う：见到人或事；<ruby>逢<rt>あ</rt></ruby>う：相逢爱人；<ruby>遭<rt>あ</rt></ruby>う：遭遇坏事；<ruby>遇<rt>あ</rt></ruby>う：遇见意外",
          },
        },

        Xinbian: {
          translation: { zh: "遇见" },
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
        {
          from: "JishoOrg",
          sentence:
            "<ruby>前<rt>まえ</rt></ruby>に<ruby>彼<rt>かれ</rt></ruby>にあったのを<ruby>覚<rt>おぼえ</rt></ruby>えている",
          translation: { zh: "（我）记得之前见过他" },
          source: "JishoOrg",
          link: "https://jisho.org/word/%E4%BC%9A%E3%81%86",
        },
      ],
      links: {
        JishoOrg: "https://jisho.org/word/%E4%BC%9A%E3%81%86",
        goo: "https://dictionary.goo.ne.jp/jn/1436/meaning/m0u/",
      },
      textbook: ["JLPT-N5-00001", "XINBIAN-01-01-0001"],
    },
    家: {
      key: "家",
      language: "ja",
      common: "<ruby>家<rt>いえ</rt></ruby>",
      alternatives: ["いえ"],
      uncommons: [],
      kana: "いえ",
      romaji: "ie",
      wapuro: "ie",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: "NOUN",
      tone: 2,
      translations: {
        GoiSimpleJaDictionary: { translation: { zh: "家" } },
        Xinbian: { translation: { zh: "家" } },
      },
      sentences: [
        {
          from: "JishoOrg",
          sentence:
            "<ruby>木立<rt>こだち</rt></ruby>の<ruby>間<rt>あいだ</rt></ruby>に<ruby>家<rt>いえ</rt></ruby>が<ruby>見<rt>み</rt></ruby>える",
          translation: { zh: "我看见树林中有一个房子" },
          source: "JishoOrg",
          link: "https://jisho.org/word/%E5%AE%B6",
        },
      ],
      links: {
        JishoOrg: "https://jisho.org/word/%E5%AE%B6",
        goo: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
      },
      textbook: ["JLPT-N5-00046", "XINBIAN-01-01-0002"],
    },
    上: {
      key: "上",
      language: "ja",
      common: "<ruby>上<rt>うえ</rt></ruby>",
      alternatives: ["うえ"],
      uncommons: [],
      kana: "うえ",
      romaji: "ue",
      wapuro: "ue",
      audios: [{ cv: "Hikari", wav: "" }],
      pos: "NOUN",
      tone: 2,
      translations: {
        GoiSimpleJaDictionary: { translation: { zh: "上" } },
        Xinbian: { translation: { zh: "上、上面" } },
      },
      sentences: [
        {
          from: "GooJisho",
          sentence: "あすは<ruby>家<rt>いえ</rt></ruby>にいます",
          translation: { zh: "明天在家" },
          source: "goo",
          link: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
        },
      ],
      links: {
        goo: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
      },
      textbook: ["JLPT-N5-00046", "XINBIAN-01-01-0003"],
    },
  },
}

export default GoiSimpleJaDictionary
