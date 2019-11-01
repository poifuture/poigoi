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
  UPDATE_FILTER,
  UpdateFilterActionType,
  UPDATE_SUBTOTAL,
  UpdateSubtotalActionType,
  BasicPos,
} from "../actions/WordAdderActions"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:WordAdderReducer")

const InitialWordAdderState: WordAdderStateType = {
  Display: false,
  Status: {
    LearnedCount: -1,
    PrioritiedCount: -1,
    PendingCount: -1,
  },
  Suggestions: [
    {
      Display: { en: "Gojuon", zh: "五十音", ja: "五十音" },
      Query: "^KANA-(HIRA|KATA).*$",
      SubQuerys: [
        {
          Display: { en: "Hiragana", zh: "平假名", ja: "平仮名" },
          Query: "^KANA-HIRAGANA-.*$",
        },
        {
          Display: { en: "Katakana", zh: "片假名", ja: "片仮名" },
          Query: "^KANA-KATAKANA-.*$",
        },
      ],
    },
    {
      Display: { en: "Kana", zh: "全部假名", ja: "仮名" },
      Query: "^(KANA|ROMAJI)-.*$",
      SubQuerys: [
        {
          Display: { en: "Hiragana", zh: "平假名", ja: "平仮名" },
          Query: "^KANA-HIRAGANA-.*$",
        },
        {
          Display: { en: "Katakana", zh: "片假名", ja: "片仮名" },
          Query: "^KANA-KATAKANA-.*$",
        },
        {
          Display: { en: "Dakuon", zh: "浊音", ja: "濁音" },
          Query: "^KANA-DAKUON-.*$",
        },
        {
          Display: { en: "Yoon", zh: "拗音", ja: "拗音" },
          Query: "^KANA-YOON-.*$",
        },
        {
          Display: { en: "Choon", zh: "长音", ja: "長音" },
          Query: "^KANA-CHOON-.*$",
        },
        {
          Display: { en: "Gairaigo", zh: "外来语", ja: "外来語" },
          Query: "^KANA-GAIRAIGO-.*$",
        },
        {
          Display: { en: "Romaji", zh: "罗马字", ja: "ローマ字" },
          Query: "^ROMAJI-.*$",
        },
      ],
    },
    {
      Display: { en: "JLPT" },
      Query: "^JLPT-.*$",
      SubQuerys: [5, 4, 3, 2, 1].map(jlptLevel => ({
        Display: {
          en: `JLPT-N${jlptLevel}`,
        },
        Query: `^JLPT-N${jlptLevel}-.*$`,
      })),
    },
    {
      Display: { en: "Biaori 01", zh: "标日初上" },
      Query: "^BIAORI-01-.*$",
      SubQuerys: [
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ...[11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        ...[21, 22, 23, 24],
      ].map(lessonId => ({
        Display: {
          en: `Biaori-01-${lessonId.toString().padStart(2, "0")}`,
          zh: `标日初上第${lessonId}课`,
        },
        Query: `^BIAORI-01-${lessonId.toString().padStart(2, "0")}-.*$`,
      })),
    },
    {
      Display: { en: "Biaori 02", zh: "标日初下" },
      Query: "^BIAORI-02-.*$",
      SubQuerys: [
        ...[25, 26, 27, 28, 29, 30],
        ...[31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        ...[41, 42, 43, 44, 45, 46, 47, 48],
      ].map(lessonId => ({
        Display: {
          en: `Biaori-02-${lessonId.toString().padStart(2, "0")}`,
          zh: `标日初下第${lessonId}课`,
        },
        Query: `^BIAORI-02-${lessonId.toString().padStart(2, "0")}-.*$`,
      })),
    },
  ],
  Pendings: [],
  Counters: {
    "^KANA-(HIRA|KATA).*$": {
      TotalCount: -1,
      LearnedCount: -1,
      AddedCount: -1,
      NewCount: -1,
    },
    "^(KANA|ROMAJI)-.*$": {
      TotalCount: -1,
      LearnedCount: -1,
      AddedCount: -1,
      NewCount: -1,
    },
    "^JLPT-.*$": {
      TotalCount: -1,
      LearnedCount: -1,
      AddedCount: -1,
      NewCount: -1,
    },
    "^BIAORI-.*$": {
      TotalCount: -1,
      LearnedCount: -1,
      AddedCount: -1,
      NewCount: -1,
    },
  },
  Filter: {
    AcceptPos: [
      ...BasicPos,
      "PROPER", //固有名詞
      "IDIOM", //熟語
    ],
    AcceptExtra: false,
    AcceptForgot: false,
  },
  Subtotal: -1,
}

export const WordAdderReducer = (
  state: Map<string, any> = fromJS(InitialWordAdderState),
  action: WordAdderActionsType
) => {
  switch (action.type) {
    case DISPLAY_WORD_ADDER: {
      debug("Hit DISPLAY_WORD_ADDER ... ")
      const typedAction = action as DisplayWordAdderActionType
      return state.merge({
        Display: typedAction.Display,
      })
    }
    case UPDATE_STATUS: {
      debug("Hit UPDATE_STATUS ... ")
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
      debug("Hit PUSH_PENDING_QUERY ... ")
      const typedAction = action as PushPendingQueryActionType
      const pendingQuerys = state.get("Pendings") as List<Map<string, any>>
      if (
        pendingQuerys.filter(
          pendingQuery => pendingQuery.get("Query") === typedAction.Query
        ).size > 0
      ) {
        debug("Already added pending query: ", typedAction.Query)
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
      debug("Hit POP_PENDING_QUERY ... ")
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
      debug("Hit PUSH_COUNT_QUERY ... ")
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
    case UPDATE_FILTER: {
      debug("Hit UPDATE_FILTER ... ")
      const { Filter } = action as UpdateFilterActionType
      return state.set("Filter", state.get("Filter").merge(Filter))
    }
    case UPDATE_SUBTOTAL: {
      debug("Hit UPDATE_SUBTOTAL ... ")
      const { Subtotal } = action as UpdateSubtotalActionType
      return state.set("Subtotal", Subtotal)
    }
  }
  return state
}

export default WordAdderReducer
