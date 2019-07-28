#!/usr/bin/env node
const fs = require("fs")

const main = () => {
  const content = fs
    .readFileSync(__dirname + "/KanaDictionaryCSV.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const lines = content.split("\n").map(line => line.trim()) // trim \r
  console.log(lines)
  const result = {}
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const cells = line.split(",")
    const kana = cells[0]
    const romaji = cells[1]
    const wapuro = cells[2]
    const type = cells[3]
    const kanaid = cells[4]
    const origin = cells[5]
    const sentence = cells[6]
    const translation = cells[7]
    result[kana] = {
      common: `<ruby>${kana}<rt>${romaji}</rt></ruby>`,
      alternatives: [],
      uncommon: [],
      kana: kana,
      romaji: romaji,
      wapuro: wapuro,
      audio: [{ cv: "Hikari", wav: "" }],
      pos: "KANA",
      translation: {
        KanaDictionary: {
          translation: { ja: kana },
          hint: {
            ja: origin,
          },
        },
      },
      sentences: [
        {
          from: "KanaDictionary",
          sentence: sentence,
          audio: [{ cv: "Hikari", wav: "" }],
          translation: { zh: translation },
        },
      ],
      textbook: [`KANA-${type}-${kanaid.padStart(5, 0)}`],
    }
  }
  fs.writeFileSync(
    __dirname + "/KanaDictionaryJson.json",
    JSON.stringify(result, null, 2)
  )
}

main()
