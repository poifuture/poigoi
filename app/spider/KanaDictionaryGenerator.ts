import fs from "fs"
import {
  GoiJaDictionaryType,
  JA_PRIMARY_POS,
  JA_POS,
} from "../src/types/GoiDictionaryTypes"

interface WordInputType {
  wordInput: string
  wordKeyInput: string
  romajiInput: string
  wapuroInput: string
  posInput: string
  jaTranslationInput: string
  jaHintInput: string
  zhTranslationInput: string
  zhHintInput: string
  zhSentanceInput: string
  zhSentanceTranslationInput: string
  bookNameInput: string
  bookChapterInput: string
  bookExtraInput: string
  bookWordIdInput: string
}
interface SpiderWordType {
  wordInput: string
  wordKey: string
  romaji: string
  wapuro: string
  pos: JA_POS
  jaTranslation: string
  jaHint: string
  zhTranslation: string
  zhHint: string
  zhSentance: string
  zhSentanceTranslation: string
  textbookTag: string
}
const parseLine = (line: string): WordInputType => {
  line = line.trim() // trim \r
  const cells = line.split(",")
  const basicCells = cells.slice(0, 29)
  const [
    wordInput,
    wordKeyInput,
    romajiInput,
    wapuroInput,
    posInput,
    jaTranslationInput,
    jaHintInput,
    zhTranslationInput,
    zhHintInput,
    zhSentanceInput,
    zhSentanceTranslationInput,
    bookNameInput,
    bookChapterInput,
    bookExtraInput,
    bookWordIdInput,
  ] = basicCells
  const word = {
    wordInput,
    wordKeyInput,
    romajiInput,
    wapuroInput,
    posInput,
    jaTranslationInput,
    jaHintInput,
    zhTranslationInput,
    zhHintInput,
    zhSentanceInput,
    zhSentanceTranslationInput,
    bookNameInput,
    bookChapterInput,
    bookExtraInput,
    bookWordIdInput,
  }
  // console.log(JSON.stringify(word, null, 2))
  return word
}
const preprocess = async () => {
  const content: string = fs
    .readFileSync(__dirname + "/KanaDictionaryInput.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const lines = content.split("\n")
  let bookNameCache = ""
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
    const romaji = word.romajiInput
    const wapuro = word.wapuroInput
    const pos = word.posInput
      .split(";")
      .filter((singlePos): singlePos is JA_PRIMARY_POS => !!singlePos)
    bookNameCache = word.bookNameInput ? word.bookNameInput : bookNameCache
    const bookName = bookNameCache + "-"
    bookChapterCache = word.bookChapterInput
      ? word.bookChapterInput
      : bookChapterCache
    const bookChapter = bookChapterCache + "-"
    const bookExtra = word.bookExtraInput ? word.bookExtraInput + "-" : ""
    bookWordIdCache = word.bookWordIdInput
      ? parseInt(word.bookWordIdInput)
      : bookWordIdCache + 1
    const bookWordId = bookWordIdCache.toString().padStart(5, "0")
    const textbookTag = bookName + bookChapter + bookExtra + bookWordId
    results.push({
      wordInput: word.wordInput,
      wordKey,
      romaji,
      wapuro,
      pos,
      jaTranslation: word.jaTranslationInput || word.wordInput,
      jaHint: word.jaHintInput,
      zhTranslation: word.zhTranslationInput,
      zhHint: word.zhHintInput,
      zhSentance: word.zhSentanceInput,
      zhSentanceTranslation: word.zhSentanceTranslationInput,
      textbookTag,
    })
  }
  return results
}
const main = async () => {
  const dictionaryName = "KanaDictionary"
  const final: GoiJaDictionaryType = {
    name: dictionaryName,
    language: "ja",
    display: { zh: "假名词典" },
    description: {
      zh: "假名词典",
    },
    schema: "Poi/Goi/RawDictionary/ja/v1",
    extends: [],
    words: {},
  }
  const prePrecessedWords = await preprocess()
  for (let index = 0; index < prePrecessedWords.length; index++) {
    const word = prePrecessedWords[index]
    if (!word.wordInput) {
      throw new Error("No word input")
    }
    if (Object.keys(final.words).includes(word.wordKey)) {
      throw new Error(`Duplicate word key: ${word.wordKey}`)
    }
    final.words[word.wordKey] = {
      key: word.wordKey,
      language: "ja",
      common: `<ruby>${word.wordInput}<rt>${word.romaji}</rt></ruby>`,
      alternatives: [],
      uncommons: [],
      kana: word.wordInput,
      romaji: word.romaji,
      wapuro: word.wapuro,
      audios: [{ cv: "Hikari", wav: "" }],
      pos: word.pos,
      translations: {
        [dictionaryName]: {
          translation: {
            ...(word.jaTranslation && { ja: word.jaTranslation }),
            ...(word.zhTranslation && { ja: word.zhTranslation }),
          },
          ...((word.jaHint || word.zhHint) && {
            hint: {
              ...(word.jaHint && { ja: word.jaHint }),
              ...(word.zhHint && { ja: word.zhHint }),
            },
          }),
        },
      },
      sentences: word.zhSentance
        ? [
            {
              from: "KanaDictionary",
              sentence: word.zhSentance,
              audios: [{ cv: "Hikari", wav: "" }],
              translation: { zh: word.zhTranslation },
            },
          ]
        : [],
      textbook: [word.textbookTag],
    }
  }
  fs.writeFileSync(
    __dirname + "/KanaDictionaryOutput.json",
    JSON.stringify(final, null, 2)
  )
  fs.copyFileSync(
    __dirname + "/KanaDictionaryOutput.json",
    __dirname + "/../src/dictionary/KanaDictionary.json"
  )
  // Validate diff, will be removed in next commit
  fs.writeFileSync(
    __dirname + "/KanaDictionaryJson.json",
    JSON.stringify(final.words, null, 2)
  )
}

main().then(() => {
  console.log("Done")
})
