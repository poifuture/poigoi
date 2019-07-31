import { WordAdderStateType } from "../states/WordAdderState"

export const DISPLAY_WORD_ADDER = "WORD_ADDER_ACTIONS_DISPLAY_WORD_ADDER"
export const PUSH_PENDING_QUERY = "WORD_ADDER_ACTIONS_PUSH_PENDING_QUERY"
export const POP_PENDING_QUERY = "WORD_ADDER_ACTIONS_POP_PENDING_QUERY"

export interface DisplayWordAdderActionType {
  type: typeof DISPLAY_WORD_ADDER
  Display: boolean
}

export interface PushPendingQueryActionType {
  type: typeof PUSH_PENDING_QUERY
  Hint: string
  Query: string
}
export interface PopPendingQueryActionType {
  type: typeof POP_PENDING_QUERY
  Query: string
}

export type WordAdderActionsType =
  | DisplayWordAdderActionType
  | PushPendingQueryActionType
  | PopPendingQueryActionType

export const DisplayWordAdderAction = (
  display: boolean = true
): DisplayWordAdderActionType => {
  return {
    type: DISPLAY_WORD_ADDER,
    Display: display,
  }
}
const countQuery = async (query: string) => {
  // TODO: countQuery
  console.debug("Counting Query... ", query)
  console.error("TODO: Count Query")
}

export const ShowWordAdderAction = () => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    state.WordAdder.get("Suggestions").map((suggestion: any) => {
      const query = suggestion.get("Query") as string
      countQuery(query)
    })
    dispatch(DisplayWordAdderAction())
  }
}

const PushPendingQueryAction = (
  hint: string,
  query: string
): PushPendingQueryActionType => {
  return {
    type: PUSH_PENDING_QUERY,
    Hint: hint,
    Query: query,
  }
}
const PopPendingQueryAction = (query: string): PopPendingQueryActionType => {
  return {
    type: POP_PENDING_QUERY,
    Query: query,
  }
}

export const AddPendingQueryAction = (hint: string, query: string) => {
  return async (dispatch: any): Promise<void> => {
    countQuery(query)
    dispatch(PushPendingQueryAction(hint, query))
  }
}

export const RemovePendingQueryAction = (query: string) => {
  return async (dispatch: any): Promise<void> => {
    dispatch(PopPendingQueryAction(query))
  }
}
