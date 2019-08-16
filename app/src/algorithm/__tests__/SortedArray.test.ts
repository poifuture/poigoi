import SortedArray from "collections/sorted-array"

describe("SortedArray", () => {
  test("DefaultSortAscending", () => {
    const sortedArray = new SortedArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    const result = []
    while (sortedArray.length !== 0) {
      result.push(sortedArray.shift())
    }
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  test("DefaultPeekSortAscending", () => {
    const sortedArray = new SortedArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    const result = []
    while (sortedArray.length !== 0) {
      result.push(sortedArray.min())
      sortedArray.shift()
    }
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  test("CustomSortDescending", () => {
    const sortedArray = new SortedArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (a, b) => a === b,
      (a, b) => {
        if (a === b) {
          return 0
        }
        return b - a
      }
    )
    const result = []
    while (sortedArray.length !== 0) {
      result.push(sortedArray.shift())
    }
    expect(result).toStrictEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })
  test("CustomObjectSortAscending", () => {
    const sortedArray = new SortedArray(
      [{ i: 1, k: "a" }, { i: 2, k: "b" }, { i: 3, k: "a" }, { i: 4, k: "b" }],
      (a, b) => a.k === b.k,
      (a, b) => {
        if (a.k === b.k) {
          return 0
        }
        return a.k > b.k ? 1 : -1
      }
    )
    const result = []
    while (sortedArray.length !== 0) {
      result.push(sortedArray.shift())
    }
    expect(result[0]).toMatchObject({ k: "a" })
    expect(result[1]).toMatchObject({ k: "a" })
    expect(result[2]).toMatchObject({ k: "b" })
    expect(result[3]).toMatchObject({ k: "b" })
  })
})
