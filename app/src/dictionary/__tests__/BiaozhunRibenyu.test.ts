import * as BiaozhunRibenyu from "../BiaozhunRibenyu"

describe("BiaozhunRibenyu", () => {
  test("BiaozhunRibenyu is loaded", () => {
    expect(BiaozhunRibenyu.BiaozhunRibenyu.name).toBe("BiaozhunRibenyu")
  })
  test("BiaozhunRibenyu words are loaded", () => {
    expect(BiaozhunRibenyu.BiaozhunRibenyu.words["中国人"].kana).toBe(
      "ちゅうごくじん"
    )
  })
})
