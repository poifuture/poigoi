export const TrimFurigana = (furiganaWord: string) => {
  return furiganaWord
    .replace(/[<]rt[>].*?[<][/]rt[>]/g, "")
    .replace(/[<][/]?ruby[>]/g, "")
    .replace(/[<][/]?ins[>]/g, "")
}

export const AsciiRomaji = (romaji: string) => {
  return romaji
    .replace(/ā/g, "a")
    .replace(/ī/g, "i")
    .replace(/ū/g, "u")
    .replace(/ē/g, "e")
    .replace(/ō/g, "o")
    .replace(/Ā/g, "A")
    .replace(/Ī/g, "I")
    .replace(/Ū/g, "U")
    .replace(/Ē/g, "E")
    .replace(/Ō/g, "O")
}
