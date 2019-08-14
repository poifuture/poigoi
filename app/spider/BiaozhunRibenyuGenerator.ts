import fs from "fs"
const KuroshiroModule = require("kuroshiro")
// import KuroshiroModule from "kuroshiro"
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")
// import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import {
  GoiJaDictionaryType,
  JA_BASIC_POS,
  JA_POS,
} from "../src/types/GoiDictionaryTypes"
import GairaigoDict from "./Gairaigo"

const kuroshiro = new KuroshiroModule()

const isHiragana = (str: string) => {
  const code = str.charCodeAt(0)
  if (0x3041 <= code && code <= 0x3096) {
    return true
  }
  return false
}
const isKatakana = (str: string) => {
  const code = str.charCodeAt(0)
  if (0x30a1 <= code && code <= 0x30fe) {
    return true
  }
  return false
}
const toFuriKatakana = ({ katakana }: { katakana: string }) => {
  let final = ""
  let nowKatakana = ""
  for (let index = 0; index < katakana.length; index++) {
    if (isKatakana(katakana[index])) {
      nowKatakana += katakana[index]
      if (index + 1 === katakana.length || !isKatakana(katakana[index + 1])) {
        const nowGairaigo = toGairaigo({ katakana: nowKatakana })
        final += `<ruby>${nowKatakana}<rt>${nowGairaigo}</rt></ruby>`
        nowKatakana = ""
      }
      continue
    }
    final += katakana[index]
  }
  return final
}
const fetchFurigana = async ({ kanji }: { kanji: string }): Promise<string> => {
  const raw: string = await kuroshiro.convert(kanji, {
    mode: "furigana",
    to: "hiragana",
  })
  const furigana = raw.replace(/[<]rp[>].*?[<][/]rp[>]/g, "")
  const furiKatakana = toFuriKatakana({ katakana: furigana })
  return furiKatakana
}
const fetchKana = async ({ kanji }: { kanji: string }): Promise<string> => {
  return await kuroshiro.convert(kanji, {
    mode: "normal",
    to: "hiragana",
  })
}
const fetchRomaji = async ({ kanji }: { kanji: string }): Promise<string> => {
  return await kuroshiro.convert(kanji, {
    to: "romaji",
    romajiSystem: "hepburn",
  })
}
const fetchWapuro = async ({ kana }: { kana: string }): Promise<string> => {
  const replaced = kana
    .replace(/ん/g, "nn")
    .replace(/ン/g, "nn")
    .replace(/ー/g, "-")
  const wapuro = await KuroshiroModule.Util.kanaToRomaji(replaced, "hepburn")
  return wapuro
}
const toGairaigo = ({ katakana }: { katakana: string }): string => {
  if (Object.keys(GairaigoDict).includes(katakana)) {
    return GairaigoDict[katakana].language
      ? `[${GairaigoDict[katakana].language}] ` + GairaigoDict[katakana].origin
      : GairaigoDict[katakana].origin
  } else {
    fs.appendFileSync(
      __dirname + "/GairaigoInput.csv",
      [katakana, "", ""].join(",") + "\n",
      { encoding: "utf-8" }
    )
  }
  return katakana
}
interface WordSplitInputType {
  wordInput: string
  manualTag: string
  charFuriganas: string[]
}
interface WordInputType {
  wordInput: string
  wordKeyInput: string
  toneInput: string
  posInput: string
  zhTranslationInput: string
  zhHintInput: string
  kanaInput: string
  romajiInput: string
  wapuroInput: string
  bookNameInput: string
  bookSeriesInput: string
  bookChapterInput: string
  bookExtraInput: string
  bookWordIdInput: string
  commonInput: WordSplitInputType
  alterInput: WordSplitInputType
  uncommonInput: WordSplitInputType
}
interface SpiderSingleWordType {
  kana: string
  furigana: string
  manualTag: string
}
interface SpiderWordType {
  wordInput: string
  wordKey: string
  zhTranslation: string
  zhHint: string
  romaji: string
  wapuro: string
  pos: JA_POS
  tone: number[] | number | null
  textbookTag: string
  common: SpiderSingleWordType
  alter: SpiderSingleWordType
  uncommon: SpiderSingleWordType
}
const padding = (array: Array<string>, len: number) => {
  if (array.length > len) {
    throw new Error("padding overflow")
  }
  for (let i = array.length; i < len; i++) {
    array.push("")
  }
  return array
}
const trimFurigana = (
  furiganaWord: string,
  { to }: { to?: "kanji" | "kana" } = {}
) => {
  to = to ? to : "kanji"
  if (to === "kanji") {
    return furiganaWord
      .replace(/[<]rt[>].*?[<][/]rt[>]/g, "")
      .replace(/[<][/]?ruby[>]/g, "")
      .replace(/[<][/]?ins[>]/g, "")
  }
  if (to === "kana") {
    return furiganaWord
      .replace(/[<]ruby[>].*?[<]rt[>]/g, "")
      .replace(/[<][/]rt[>][<][/]ruby[>]/g, "")
      .replace(/[<][/]?ins[>]/g, "")
  }
  throw new Error("Trim to " + to + " is unsupported")
}
const splitFurigana = ({ furigana }: { furigana: string }) => {
  return furigana
    .replace(/[<][/]?ruby[>]/g, ",")
    .replace(/[<][/]?rt[>]/g, ",")
    .split(",")
    .filter(cell => !!cell)
}
const validateFurigana = ({
  furigana,
  kana,
}: {
  furigana: string
  kana: string
}) => {
  const trimed = trimFurigana(furigana, { to: "kana" })
  return trimed == kana
}
const toFurigana = ({
  wordSplitInput,
}: {
  wordSplitInput: WordSplitInputType
}) => {
  const charFuriganas = wordSplitInput.charFuriganas
  let htmlFurigana = ""
  for (let kanjiId = 0; kanjiId < charFuriganas.length; kanjiId += 2) {
    if (charFuriganas[kanjiId] && charFuriganas[kanjiId + 1]) {
      if (
        charFuriganas[kanjiId].length > 1 ||
        (!isHiragana(charFuriganas[kanjiId]) &&
          !isKatakana(charFuriganas[kanjiId]))
      ) {
        htmlFurigana += `<ruby>${charFuriganas[kanjiId]}<rt>${
          charFuriganas[kanjiId + 1]
        }</rt></ruby>`
        continue
      }
    }
    htmlFurigana += `${charFuriganas[kanjiId]}`
  }
  // const furiKatakana = toFuriKatakana({ katakana: htmlFurigana })
  return htmlFurigana
}
const toKana = ({ wordSplitInput }: { wordSplitInput: WordSplitInputType }) => {
  const charFuriganas = wordSplitInput.charFuriganas
  let kana = ""
  for (let kanjiId = 0; kanjiId < charFuriganas.length; kanjiId += 2) {
    if (charFuriganas[kanjiId] && charFuriganas[kanjiId + 1]) {
      if (
        isHiragana(charFuriganas[kanjiId]) ||
        isKatakana(charFuriganas[kanjiId])
      ) {
        kana += charFuriganas[kanjiId]
      } else {
        kana += charFuriganas[kanjiId + 1]
      }
    } else {
      kana += `${charFuriganas[kanjiId]}${charFuriganas[kanjiId + 1]}`
    }
  }
  return kana
}
const parseWordSplitCells = (
  cells: string[],
  { defaultWordInput }: { defaultWordInput?: string } = {}
): WordSplitInputType => {
  const [
    wordInput,
    manualTag,
    _autoTag,
    _byExcel,
    _byConcat,
    _unusedOffsite1,
    _unusedOffsite2,
    ...charFuriganas
  ] = cells
  if (!wordInput) {
    return {
      wordInput: defaultWordInput || "",
      manualTag: "",
      charFuriganas: ["", ""],
    }
  }
  const wordSplit = {
    wordInput,
    manualTag,
    _autoTag,
    _byExcel,
    _byConcat,
    _unusedOffsite1,
    _unusedOffsite2,
    charFuriganas,
  }
  return wordSplit
}
const parseLine = (line: string): WordInputType => {
  line = line.trim() // trim \r
  const cells = line.split(",")
  const basicCells = cells.slice(0, 29)
  const commonWordCells = cells.slice(30, 59)
  const alterWordCells = cells.slice(60, 89)
  const uncommonWordCells = cells.slice(90, 120)
  const [
    wordInput,
    wordKeyInput,
    toneInput,
    posInput,
    zhTranslationInput,
    zhHintInput,
    kanaInput,
    romajiInput,
    wapuroInput,
    bookNameInput,
    bookSeriesInput,
    bookChapterInput,
    bookExtraInput,
    bookWordIdInput,
  ] = basicCells
  const word = {
    wordInput,
    wordKeyInput,
    toneInput,
    posInput,
    zhTranslationInput,
    zhHintInput,
    kanaInput,
    romajiInput,
    wapuroInput,
    bookNameInput,
    bookSeriesInput,
    bookChapterInput,
    bookExtraInput,
    bookWordIdInput,
    commonInput: parseWordSplitCells(commonWordCells, {
      defaultWordInput: wordInput,
    }),
    alterInput: parseWordSplitCells(alterWordCells),
    uncommonInput: parseWordSplitCells(uncommonWordCells),
  }
  // console.log(JSON.stringify(word, null, 2))
  return word
}
const preprocess = async () => {
  const content: string = fs
    .readFileSync(__dirname + "/BiaozhunRibenyuInput.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const lines = content.split("\n")
  let bookNameCache = ""
  let bookSeriesCache = ""
  let bookChapterCache = ""
  let bookWordIdCache = 0
  let results: SpiderWordType[] = []
  // for (let index = 555; index < 557; index++) {
  for (let index = 1; index < lines.length; index++) {
    const word = parseLine(lines[index])
    if (!word.wordInput) {
      throw new Error("No word input")
    }
    const wordKey = word.wordKeyInput || word.wordInput
    const common = {
      kana:
        word.kanaInput ||
        toKana({ wordSplitInput: word.commonInput }) ||
        (await fetchKana({ kanji: word.wordInput })),
      furigana:
        toFurigana({ wordSplitInput: word.commonInput }) ||
        (await fetchFurigana({ kanji: word.commonInput.wordInput })),
      manualTag: word.commonInput.manualTag,
    }
    const alter = {
      kana:
        toKana({ wordSplitInput: word.alterInput }) ||
        (await fetchKana({ kanji: word.alterInput.wordInput })),
      furigana:
        toFurigana({ wordSplitInput: word.alterInput }) ||
        (await fetchFurigana({ kanji: word.alterInput.wordInput })),
      manualTag: word.alterInput.manualTag,
    }
    const uncommon = {
      kana:
        toKana({ wordSplitInput: word.uncommonInput }) ||
        (await fetchKana({ kanji: word.uncommonInput.wordInput })),
      furigana:
        toFurigana({ wordSplitInput: word.uncommonInput }) ||
        (await fetchFurigana({ kanji: word.uncommonInput.wordInput })),
      manualTag: word.uncommonInput.manualTag,
    }
    const romaji =
      word.romajiInput || (await fetchRomaji({ kanji: word.wordInput }))
    const wapuro =
      word.wapuroInput || (await fetchWapuro({ kana: common.kana }))
    const posArray = word.posInput
      .split(";")
      .filter((singlePos): singlePos is JA_BASIC_POS => !!singlePos)
    const pos =
      posArray.length === 0
        ? "IDIOM"
        : posArray.length === 1
        ? posArray[0]
        : posArray
    const toneArray = word.toneInput
      .split(";")
      .map(singleToneString =>
        singleToneString ? parseInt(singleToneString) : null
      )
      .filter((toneNumber): toneNumber is number => toneNumber !== null)
    const tone =
      word.toneInput === "?"
        ? null
        : toneArray.length === 0
        ? null
        : toneArray.length === 1
        ? toneArray[0]
        : toneArray
    bookNameCache = word.bookNameInput ? word.bookNameInput : bookNameCache
    const bookName = bookNameCache + "-"
    bookSeriesCache = word.bookSeriesInput
      ? word.bookSeriesInput
      : bookSeriesCache
    const bookSeries = bookSeriesCache.padStart(2, "0") + "-"
    bookChapterCache = word.bookChapterInput
      ? word.bookChapterInput
      : bookChapterCache
    const bookChapter = bookChapterCache.padStart(2, "0") + "-"
    const bookExtra = word.bookExtraInput ? word.bookExtraInput + "-" : ""
    bookWordIdCache = word.bookWordIdInput
      ? parseInt(word.bookWordIdInput)
      : bookWordIdCache + 1
    const bookWordId = bookWordIdCache.toString().padStart(4, "0")
    const textbookTag =
      bookName + bookSeries + bookChapter + bookExtra + bookWordId
    results.push({
      wordInput: word.wordInput,
      wordKey,
      zhTranslation: word.zhTranslationInput,
      zhHint: word.zhHintInput,
      romaji,
      wapuro,
      pos,
      tone,
      textbookTag,
      common,
      alter,
      uncommon,
    })
  }
  fs.writeFileSync(
    __dirname + "/BiaozhunRibenyuValidate.csv",
    "\ufeff" +
      [
        "word",
        "key",
        "trans",
        "hint",
        "kana",
        "romaji",
        "wapuro",
        "pos",
        "tone",
        "textbook",
      ].join(",") +
      "\n",
    { encoding: "utf-8" }
  )
  for (let index = 0; index < results.length; index++) {
    const processedWord = results[index]
    fs.appendFileSync(
      __dirname + "/BiaozhunRibenyuValidate.csv",
      [
        processedWord.wordInput,
        processedWord.wordKey,
        processedWord.zhTranslation,
        processedWord.zhHint,
        processedWord.common.kana,
        processedWord.romaji,
        processedWord.wapuro,
        JSON.stringify(processedWord.pos).replace(",", "|"),
        JSON.stringify(processedWord.tone).replace(",", "|"),
        processedWord.textbookTag,
        processedWord.common.manualTag !== "special" &&
        processedWord.common.manualTag !== "gairaigo" &&
        !validateFurigana(processedWord.common)
          ? "WARNING"
          : "",
        ...padding(
          splitFurigana({ furigana: processedWord.common.furigana || "" }),
          30
        ),
        processedWord.alter.manualTag !== "special" &&
        !validateFurigana(processedWord.alter)
          ? "WARNING"
          : "",
        ...padding(
          splitFurigana({ furigana: processedWord.alter.furigana || "" }),
          30
        ),
        processedWord.uncommon.manualTag !== "special" &&
        !validateFurigana(processedWord.uncommon)
          ? "WARNING"
          : "",
        ...padding(
          splitFurigana({ furigana: processedWord.uncommon.furigana || "" }),
          30
        ),
      ].join(",") + "\n",
      { encoding: "utf-8" }
    )
  }
  return results
}
const main = async () => {
  await kuroshiro.init(new KuromojiAnalyzer())
  const dictionaryName = "BiaozhunRibenyu"
  const final: GoiJaDictionaryType = {
    name: dictionaryName,
    language: "ja",
    display: { zh: "《标准日本语》单词表" },
    description: {
      zh:
        "作为《标准日本语》教辅使用，保持与标日单词表完全一致，适合需要面对老师听写的同学 >w<",
    },
    schema: "Poi/Goi/RawDictionary/ja/v1",
    extends: [],
    words: {},
  }
  const textbookCache: { [key: string]: string[] } = {}
  const prePrecessedWords = await preprocess()
  for (let index = 0; index < prePrecessedWords.length; index++) {
    const word = prePrecessedWords[index]
    if (!word.wordInput) {
      throw new Error("No word input")
    }
    textbookCache[word.wordKey] = [
      word.textbookTag,
      ...(textbookCache[word.wordKey] ? textbookCache[word.wordKey] : []),
    ]
    if (word.zhHint === "duplicate") {
      if (final.words[word.wordKey]) {
        final.words[word.wordKey].textbook.push(word.textbookTag)
      }
      continue
    }
    if (Object.keys(final.words).includes(word.wordKey)) {
      throw new Error(`Duplicate word key: ${word.wordKey}`)
    }
    final.words[word.wordKey] = {
      key: word.wordKey,
      language: "ja",
      common: word.common.furigana,
      alternatives: word.alter.furigana ? [word.alter.furigana] : [],
      uncommons: word.uncommon.furigana ? [word.uncommon.furigana] : [],
      kana: word.common.kana,
      romaji: word.romaji,
      wapuro: word.wapuro,
      audios: [{ cv: "Hikari", wav: "" }],
      pos: word.pos,
      ...(word.tone !== null && { tone: word.tone }),
      translations: {
        [dictionaryName]: {
          translation: { zh: word.zhTranslation },
          ...(word.zhHint && {
            hint: {
              zh: word.zhHint,
            },
          }),
        },
      },
      sentences: [],
      textbook: textbookCache[word.wordKey],
    }
  }
  fs.writeFileSync(
    __dirname + "/BiaozhunRibenyuOutput.json",
    JSON.stringify(final, null, 2)
  )
  fs.copyFileSync(
    __dirname + "/BiaozhunRibenyuOutput.json",
    __dirname + "/../src/dictionary/BiaozhunRibenyu.json"
  )
}

main().then(() => {
  console.log("Done")
})
