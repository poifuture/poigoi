// https://prowriters.jp/grammar/verb

export const JA_VERB_GODAN_JIDOSHI = "JA_VERB_GODAN_JIDOSHI"
export const JA_NOUN = "JA_NOUN"
export default SimpleDictionary = {
  会う: {
    common: "<ruby>会<rt>あ</rt></ruby>う",
    alternatives: ["あう"],
    uncommon: [],
    kana: "あう",
    romaji: "au",
    wapuro: "au",
    audio: [{ cv: "Hikari", wav: "" }],
    type: JA_VERB_GODAN_JIDOUSHI,
    chinese: [
      {
        from: "SimpleDictionary",
        chinese: "见",
        hint:
          "【同训异字】<ruby>会<rt>あ</rt></ruby>う：见到人或事；<ruby>逢<rt>あ</rt></ruby>う：相逢爱人；<ruby>遭<rt>あ</rt></ruby>う：遭遇坏事；<ruby>遇<rt>あ</rt></ruby>う：遇见意外",
      },
      { from: "Xinbian", chinese: "遇见" },
    ],
    katsuyo: {
      keigo: "<ruby>会<rt>あ</rt></ruby>います",
    },
    sentences: [
      {
        from: "AnimeSong",
        sentence:
          "ねぇ、<ruby>今<rt>いま</rt></ruby>すぐ<ruby>会<rt>あ</rt></ruby>いたいよ",
        audio: [{ cv: "Hikari", wav: "" }],
        chinese: "现在好想快点见到你啊",
        source: "GUMI『会いたい』",
        link: "https://www.nicovideo.jp/watch/sm11713594",
        contributor: "凪",
      },

      {
        from: "JishoOrg",
        sentence:
          "<ruby>前<rt>まえ</rt></ruby>に<ruby>彼<rt>かれ</rt></ruby>にあったのを<ruby>覚<rt>おぼえ</rt></ruby>えている",
        chinese: "（我）记得之前见过他",
        source: "JishoOrg",
        link: "https://jisho.org/word/%E4%BC%9A%E3%81%86",
      },
    ],
    link: {
      jishoorg: "https://jisho.org/word/%E4%BC%9A%E3%81%86",
      goo: "https://dictionary.goo.ne.jp/jn/1436/meaning/m0u/",
    },
    textbook: ["JLPT-N5-00001", "XINBIAN-01-01-0001"],
  },
  家: {
    common: "<ruby>家<rt>いえ</rt></ruby>",
    alternatives: ["いえ"],
    uncommon: [],
    kana: "いえ",
    romaji: "ie",
    wapuro: "ie",
    audio: [{ cv: "Hikari", wav: "" }],
    type: JA_NOUN,
    chinese: [
      { from: "SimpleDictionary", chinese: "家" },
      { from: "Xinbian", chinese: "家" },
    ],
    sentences: [
      ,
      {
        from: "JishoOrg",
        sentence:
          "<ruby>木立<rt>こだち</rt></ruby>の<ruby>間<rt>あいだ</rt></ruby>に<ruby>家<rt>いえ</rt></ruby>が<ruby>見<rt>み</rt></ruby>える",
        chinese: "我看见树林中有一个房子",
        source: "JishoOrg",
        link: "https://jisho.org/word/%E5%AE%B6",
      },
    ],
    link: {
      jishoorg: "https://jisho.org/word/%E5%AE%B6",
      goo: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
    },
    textbook: ["JLPT-N5-00046", "XINBIAN-01-01-0002"],
  },
  上: {
    common: "<ruby>上<rt>うえ</rt></ruby>",
    alternatives: ["うえ"],
    uncommon: [],
    kana: "うえ",
    romaji: "ue",
    wapuro: "ue",
    audio: [{ cv: "Hikari", wav: "" }],
    type: JA_NOUN,
    chinese: [
      { from: "SimpleDictionary", chinese: "上" },
      { from: "Xinbian", chinese: "上、上面" },
    ],
    sentences: [
      {
        from: "GooJisho",
        sentence: "あすは<ruby>家<rt>いえ</rt></ruby>にいます",
        chinese: "明天在家",
        source: "goo",
        link: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
      },
    ],
    link: {
      goo: "https://dictionary.goo.ne.jp/jn/9800/meaning/m0u/",
    },
    textbook: ["JLPT-N5-00046", "XINBIAN-01-01-0003"],
  },
}
