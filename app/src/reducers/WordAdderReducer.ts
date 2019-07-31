import { fromJS, Map, List } from "immutable"
import {
  WordAdderStateType,
  WordAdderPendingQueryType,
} from "../states/WordAdderState"
import {
  WordAdderActionsType,
  DisplayWordAdderActionType,
  PushPendingQueryActionType,
  PopPendingQueryActionType,
  DISPLAY_WORD_ADDER,
  PUSH_PENDING_QUERY,
  POP_PENDING_QUERY,
} from "../actions/WordAdderActions"

const InitialWordAdderState: WordAdderStateType = {
  Display: true,
  Status: {
    LearnedCount: 0,
    PrioritizedCount: 0,
    PendingCount: 0,
  },
  Suggestions: [
    {
      Hint: "Kana",
      Query: "KANA-*",
    },
    {
      Hint: "JLPT-N5",
      Query: "JLPT-N5-*",
    },
  ],
  Pendings: [],
  Counters: {
    "KANA-*": {
      TotalCount: 0,
      LearnedCount: 0,
      AddedCount: 0,
      NewCount: 0,
    },
    "JLPT-N5-*": {
      TotalCount: 0,
      LearnedCount: 0,
      AddedCount: 0,
      NewCount: 0,
    },
  },
}

export const WordAdderReducer = (
  state: Map<string, any> = fromJS(InitialWordAdderState),
  action: WordAdderActionsType
) => {
  console.debug("Reducing WordAdder... ", action.type)
  switch (action.type) {
    case DISPLAY_WORD_ADDER: {
      console.debug("Hit DISPLAY_WORD_ADDER ... ", action)
      const typedAction = action as DisplayWordAdderActionType
      return state.merge({
        Display: typedAction.Display,
      })
    }
    case PUSH_PENDING_QUERY: {
      console.debug("Hit PUSH_PENDING_QUERY ... ", action)
      const typedAction = action as PushPendingQueryActionType
      const pendingQuerys = state.get("Pendings") as List<Map<string, any>>
      if (
        pendingQuerys.filter(
          pendingQuery => pendingQuery.get("Query") === typedAction.Query
        ).size > 0
      ) {
        console.debug("Already added pending query: ", typedAction.Query)
        return state
      }
      const pendingQuery: WordAdderPendingQueryType = {
        Hint: typedAction.Hint,
        Query: typedAction.Query,
      }
      return state.set(
        "Pendings",
        state.get("Pendings").push(fromJS(pendingQuery))
      )
    }
    case POP_PENDING_QUERY: {
      console.debug("Hit POP_PENDING_QUERY ... ", action)
      const typedAction = action as PopPendingQueryActionType
      return state.set(
        "Pendings",
        state
          .get("Pendings")
          .filter(
            (pendingQuery: Map<string, any>) =>
              pendingQuery.get("Query") !== typedAction.Query
          )
      )
    }
  }
  return state
}

export default WordAdderReducer
