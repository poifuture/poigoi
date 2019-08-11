#!/usr/local/bin/npx ts-node

const fs = require("fs")
// import fs from "fs"
import {
  GoiJaDictionaryType,
  JA_BASIC_POS,
} from "../src/types/GoiDictionaryTypes"

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
const processSplitFurigana = (wordCells: string[]) => {
  const [
    _commonWord,
    _manualTag,
    _autoTag,
    _byExcel,
    _byConcat,
    _unusedOffsite1,
    _unusedOffsite2,
    ...charFuriganas
  ] = wordCells

  let htmlFurigana = ""
  for (let kanjiId = 0; kanjiId < charFuriganas.length; kanjiId += 2) {
    if (charFuriganas[kanjiId] && charFuriganas[kanjiId + 1]) {
      if (
        !isHiragana(charFuriganas[kanjiId]) &&
        !isKatakana(charFuriganas[kanjiId])
      ) {
        htmlFurigana += `<ruby>${charFuriganas[kanjiId]}<rt>${
          charFuriganas[kanjiId + 1]
        }</rt></ruby>`
        continue
      }
    }
    htmlFurigana += `${charFuriganas[kanjiId]}`
  }
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
  return { htmlFurigana, kana }
}
const getRomaji = (kana: string) => {
  return ""
}
const getWapuro = (kana: string) => {
  return ""
}
const main = () => {
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
  const content: string = fs
    .readFileSync(__dirname + "/BiaozhunRibenyuInput.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const allLines = content.split("\n").map((line: string) => line.trim()) // trim \r
  const lines = allLines.slice(1) // cut table header
  console.log(lines)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
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
    const [
      _commonWord,
      _manualTag,
      _autoTag,
      _byExcel,
      _byConcat,
      _unusedOffsite1,
      _unusedOffsite2,
      ...charFuriganas
    ] = commonWordCells
    const inputs = {
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
      _commonWord,
      _manualTag,
      _autoTag,
      _byExcel,
      _byConcat,
      _unusedOffsite1,
      _unusedOffsite2,
      charFuriganas,
    }
    Object.entries(inputs).map(([key, value]) => {
      console.log(`${key}:${value}`)
    })
    console.log(charFuriganas)
    if (!wordInput) {
      throw new Error("No word input")
    }
    const prepareCommon = processSplitFurigana(commonWordCells)
    const prepareAlter = alterWordCells[0]
      ? processSplitFurigana(alterWordCells)
      : null
    const prepareUncommon = uncommonWordCells[0]
      ? processSplitFurigana(uncommonWordCells)
      : null

    const wordKey = wordKeyInput || wordInput
    const common = prepareCommon.htmlFurigana
    const kana = kanaInput || prepareCommon.kana
    const romaji = romajiInput || ""
    const wapuro = wapuroInput || ""
    const posArray = posInput
      .split(";")
      .filter((singlePos): singlePos is JA_BASIC_POS => !!singlePos)
    const pos =
      posArray.length === 0
        ? "IDIOM"
        : posArray.length === 1
        ? posArray[0]
        : posArray
    const toneArray = toneInput
      .split(";")
      .map(singleToneString =>
        singleToneString ? parseInt(singleToneString) : null
      )
      .filter((toneNumber): toneNumber is number => toneNumber !== null)
    const tone =
      toneArray.length === 0
        ? null
        : toneArray.length === 1
        ? toneArray[0]
        : toneArray

    const bookName = (bookNameInput ? bookNameInput : "BIAORI") + "-"
    const bookSeries = bookSeriesInput.padStart(2, "0") + "-"
    const bookChapter = bookChapterInput.padStart(2, "0") + "-"
    const bookExtra = bookExtraInput ? bookExtraInput + "-" : ""
    const bookWordId = bookWordIdInput.padStart(4, "0")
    const textbookTag =
      bookName + bookSeries + bookChapter + bookExtra + bookWordId
    textbookCache[wordKey] = [
      textbookTag,
      ...(textbookCache[wordKey] ? textbookCache[wordKey] : []),
    ]
    if (zhHintInput === "duplicate") {
      if (final.words[wordKey]) {
        final.words[wordKey].textbook.push(textbookTag)
      }
      continue
    }
    if (Object.keys(final.words).includes(wordKey)) {
      throw new Error(`Duplicate word key: ${wordKey}`)
    }
    final.words[wordKey] = {
      key: wordKey,
      language: "ja",
      common: common,
      alternatives: prepareAlter ? [prepareAlter.htmlFurigana] : [],
      uncommons: prepareUncommon ? [prepareUncommon.htmlFurigana] : [],
      kana: kana,
      romaji: romaji,
      wapuro: wapuro,
      audios: [{ cv: "Hikari", wav: "" }],
      pos: pos,
      ...(tone !== null && { tone }),
      translations: {
        [dictionaryName]: {
          translation: { zh: zhTranslationInput },
          ...(zhHintInput && {
            hint: {
              zh: zhHintInput,
            },
          }),
        },
      },
      sentences: [],
      textbook: textbookCache[wordKey],
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

main()
