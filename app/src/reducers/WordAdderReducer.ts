import { fromJS, Map, List } from "immutable"
import {
  WordAdderStateType,
  WordAdderPendingQueryType,
} from "../states/WordAdderState"
import {
  WordAdderActionsType,
  DisplayWordAdderActionType,
  UpdateStatusActionType,
  PushPendingQueryActionType,
  PopPendingQueryActionType,
  PushCountQueryActionType,
  DISPLAY_WORD_ADDER,
  UPDATE_STATUS,
  PUSH_PENDING_QUERY,
  POP_PENDING_QUERY,
  PUSH_COUNT_QUERY,
} from "../actions/WordAdderActions"

const InitialWordAdderState: WordAdderStateType = {
  Display: false,
  Status: {
    LearnedCount: 0,
    PrioritiedCount: 0,
    PendingCount: 0,
  },
  Suggestions: [
    {
      Display: { en: "Kana", zh: "假名", ja: "仮名" },
      Query: "^KANA-.*$",
      SubQuerys: [
        {
          Display: { en: "Hiragana", zh: "平假名", ja: "平仮名" },
          Query: "^KANA-HIRAGANA.*$",
        },
        {
          Display: { en: "Katakana", zh: "片假名", ja: "片仮名" },
          Query: "^KANA-KATAKANA.*$",
        },
        {
          Display: { en: "Dakuon", zh: "浊音", ja: "濁音" },
          Query: "^KANA-DAKUON.*$",
        },
        {
          Display: { en: "Yoon", zh: "拗音", ja: "拗音" },
          Query: "^KANA-YOON.*$",
        },
        {
          Display: { en: "Choon", zh: "长音", ja: "長音" },
          Query: "^KANA-CHOON.*$",
        },
      ],
    },
    {
      Display: { en: "JLPT" },
      Query: "^JLPT-.*$",
      SubQuerys: [
        {
          Display: { en: "JLPT-N5" },
          Query: "^JLPT-N5-.*$",
        },
        {
          Display: { en: "JLPT-N4" },
          Query: "^JLPT-N4-.*$",
        },
        {
          Display: { en: "JLPT-N3" },
          Query: "^JLPT-N3-.*$",
        },
        {
          Display: { en: "JLPT-N2" },
          Query: "^JLPT-N5-.*$",
        },
        {
          Display: { en: "JLPT-N1" },
          Query: "^JLPT-N1-.*$",
        },
      ],
    },
  ],
  Pendings: [],
  Counters: {
    "^KANA-.*$": {
      TotalCount: 0,
      LearnedCount: 0,
      AddedCount: 0,
      NewCount: 0,
    },
    "^JLPT-.*$": {
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
    case UPDATE_STATUS: {
      console.debug("Hit UPDATE_STATUS ... ", action)
      const typedAction = action as UpdateStatusActionType
      return state.set(
        "Status",
        state.get("Status").merge({
          LearnedCount: typedAction.LearnedCount,
          PrioritiedCount: typedAction.PrioritiedCount,
          PendingCount: typedAction.PendingCount,
        })
      )
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
        Display: typedAction.Display,
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
    case PUSH_COUNT_QUERY: {
      console.debug("Hit PUSH_COUNT_QUERY ... ", action)
      const typedAction = action as PushCountQueryActionType
      return state.set(
        "Counters",
        state.get("Counters").set(typedAction.Query, {
          TotalCount: typedAction.TotalCount,
          LearnedCount: typedAction.LearnedCount,
          AddedCount: typedAction.AddedCount,
          NewCount: typedAction.NewCount,
        })
      )
    }
  }
  return state
}

export default WordAdderReducer
