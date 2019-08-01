import { GoiJaWordType } from "../types/GoiDictionaryTypes"

export const CHANGE_GOI_TESTER_WORD =
  "GOI_JA_TESTER_ACTIONS_CHANGE_GOI_TESTER_WORD"

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
