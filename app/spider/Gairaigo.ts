import fs from "fs"

const prepare = () => {
  const content: string = fs
    .readFileSync(__dirname + "/GairaigoInput.csv", { encoding: "utf8" })
    .trim() // trim BOM and newline
  const lines = content.split("\n")
  const dict: {
    [key: string]: { word: string; origin: string; language: string }
  } = {}
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim()
    const [word, origin, language] = line.split(",")
    dict[word] = { word, origin, language }
  }
  return dict
}

export const GairaigoDict = prepare()
export default GairaigoDict
