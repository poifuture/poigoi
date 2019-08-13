export const TrimFurigana = (
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

export default {
  TrimFurigana,
  AsciiRomaji,
}
