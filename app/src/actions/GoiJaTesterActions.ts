import { GoiJaWordType } from "../dictionary/GoiDictionary"

export const CHANGE_GOI_TESTER_WORD = "CHANGE_GOI_TESTER_WORD"

interface ChangeGoiJaTesterWordAction {
  type: typeof CHANGE_GOI_TESTER_WORD
  word: GoiJaWordType
}

export type GoiJaTesterActionTypes = ChangeGoiJaTesterWordAction

export function changeGoiJaTesterWord(
  newWord: GoiJaWordType
): GoiJaTesterActionTypes {
  return {
    type: CHANGE_GOI_TESTER_WORD,
    word: newWord,
  }
}
