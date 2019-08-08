#!/usr/local/bin/npx ts-node

const fs = require("fs")
// import fs from "fs"
import { GoiJaDictionaryType } from "../src/types/GoiDictionaryTypes"

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
  const content = fs
    .readFileSync(__dirname + "/BiaozhunRibenyuInput.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const allLines = content.split("\n").map((line: string) => line.trim()) // trim \r
  const lines = allLines.slice(1) // cut table header
  console.log(lines)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const cells = line.split(",")
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
      _manualTag,
      _autoTag,
      _byExcel,
      _byConcat,
      _unusedOffsite1,
      _unusedOffsite2,
      ...charFuriganas
    ] = cells
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
      continue
    }
    if (charFuriganas.length % 2 === 1) {
      charFuriganas.push("")
    }
    let prepareCommon = ""
    for (let kanjiId = 0; kanjiId < charFuriganas.length; kanjiId += 2) {
      if (charFuriganas[kanjiId] && charFuriganas[kanjiId + 1]) {
        if (
          !isHiragana(charFuriganas[kanjiId]) &&
          !isKatakana(charFuriganas[kanjiId])
        ) {
          prepareCommon += `<ruby>${charFuriganas[kanjiId]}<rt>${
            charFuriganas[kanjiId + 1]
          }</rt></ruby>`
          continue
        }
      }
      prepareCommon += `${charFuriganas[kanjiId]}`
    }
    let prepareKana = ""
    for (let kanjiId = 0; kanjiId < charFuriganas.length; kanjiId += 2) {
      if (charFuriganas[kanjiId] && charFuriganas[kanjiId + 1]) {
        if (
          isHiragana(charFuriganas[kanjiId]) ||
          isKatakana(charFuriganas[kanjiId])
        ) {
          prepareKana += charFuriganas[kanjiId]
        } else {
          prepareKana += charFuriganas[kanjiId + 1]
        }
      } else {
        prepareKana += `${charFuriganas[kanjiId]}${charFuriganas[kanjiId + 1]}`
      }
    }
    const wordKey = wordKeyInput || wordInput
    const common = prepareCommon
    const kana = kanaInput || prepareKana
    const romaji = romajiInput || ""
    const wapuro = wapuroInput || ""
    const pos = posInput as any
    const bookName = (bookNameInput ? bookNameInput : "BIAORI") + "-"
    const bookSeries = bookSeriesInput.padStart(2, "0") + "-"
    const bookChapter = bookChapterInput.padStart(2, "0") + "-"
    const bookExtra = bookExtraInput ? bookExtraInput + "-" : ""
    const bookWordId = bookWordIdInput.padStart(4, "0")
    const textbookTag =
      bookName + bookSeries + bookChapter + bookExtra + bookWordId
    if (Object.keys(final.words).includes(wordKey)) {
      if (zhTranslationInput !== "duplicate") {
        throw new Error(`Duplicate word key: ${wordKey}`)
      }
      final.words[wordKey].textbook.push(textbookTag)
      continue
    }
    final.words[wordKey] = {
      key: wordKey,
      language: "ja",
      common: common,
      alternatives: [],
      uncommons: [],
      kana: kana,
      romaji: romaji,
      wapuro: wapuro,
      audios: [{ cv: "Hikari", wav: "" }],
      pos: pos,
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
      textbook: [textbookTag],
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
