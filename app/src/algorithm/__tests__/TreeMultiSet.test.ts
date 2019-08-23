import { TreeMultiSet } from "tstl"

describe("TreeMultiSet", () => {
  test("DefaultSortAscending", () => {
    const treeMultiSet = new TreeMultiSet<number>([8, 7, 6, 5, 4, 3, 2, 1])
    const result = []
    while (treeMultiSet.size() !== 0) {
      result.push(treeMultiSet.begin().value)
      treeMultiSet.erase(treeMultiSet.begin())
    }
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
  test("CustomSortDescending", () => {
    const treeMultiSet = new TreeMultiSet<number>(
      [1, 2, 3, 4, 5, 6, 7, 8],
      (x, y) => {
        return x > y
      }
    )
    const result = []
    while (treeMultiSet.size() !== 0) {
      result.push(treeMultiSet.begin().value)
      treeMultiSet.erase(treeMultiSet.begin())
    }
    expect(result).toStrictEqual([8, 7, 6, 5, 4, 3, 2, 1])
  })
  test("CustomObjectSortAscending", () => {
    const treeMultiSet = new TreeMultiSet(
      [{ i: 1, k: "a" }, { i: 2, k: "b" }, { i: 3, k: "a" }, { i: 4, k: "b" }],
      (x, y) => {
        return x.k < y.k
      }
    )
    const result = []
    while (treeMultiSet.size() !== 0) {
      result.push(treeMultiSet.begin().value)
      treeMultiSet.erase(treeMultiSet.begin())
    }
    expect(result[0]).toMatchObject({ k: "a" })
    expect(result[1]).toMatchObject({ k: "a" })
    expect(result[2]).toMatchObject({ k: "b" })
    expect(result[3]).toMatchObject({ k: "b" })
  })
})
