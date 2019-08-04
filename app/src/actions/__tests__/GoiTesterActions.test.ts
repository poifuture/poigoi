import "../../testing/GoiTesting"
import { GoiDb } from "../../utils/GoiDb"
import TestingDictionary from "../../testing/TestingDictionary"

import * as GoiTesterActions from "../GoiTesterActions"

describe("GoiTesterActions", () => {
  beforeAll(async () => {
    GoiDb({ test: true })
  })

  describe("VerifyAnswer", () => {
    describe("VerifyJaAnswer", () => {
      describe("DefaultBehavior", () => {
        test("DefaultCorrect", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "会う",
              TestingDictionary.words["会う"]
            )
          ).toBe("Correct")
        })
        test("DefaultWrong", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "WrongAnswer",
              TestingDictionary.words["会う"]
            )
          ).toBe("Wrong")
        })
        test("DefaultAcceptAlternatives", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "逢う",
              TestingDictionary.words["会う"]
            )
          ).toBe("Accepted")
        })
        test("DefaultAcceptKana", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "あう",
              TestingDictionary.words["会う"]
            )
          ).toBe("Accepted")
        })
        test("DefaultAcceptWapuro", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "toukyou",
              TestingDictionary.words["東京"]
            )
          ).toBe("Accepted")
        })
        test("DefaultRejectUncommon", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "御馳走様",
              TestingDictionary.words["ご馳走さま"]
            )
          ).toBe("Rejected")
        })
        test("DefaultRejectRomaji", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "Tokyo",
              TestingDictionary.words["東京"]
            )
          ).toBe("Rejected")
        })
        test("DefaultRejectKeigo", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "会います",
              TestingDictionary.words["会う"]
            )
          ).toBe("Rejected")
        })
      })
      describe("ChangeWapuroBehavior", () => {
        test("RejectWapuro", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "toukyou",
              TestingDictionary.words["東京"],
              { wapuro: "Rejected" }
            )
          ).toBe("Rejected")
        })
      })
      describe("ChangeKeigoBehavior", () => {
        test("AcceptKeigo", async () => {
          expect(
            GoiTesterActions.VerifyJaAnswer(
              "会います",
              TestingDictionary.words["会う"],
              { keigo: "Accepted" }
            )
          ).toBe("Accepted")
        })
      })
    })
  })
})
