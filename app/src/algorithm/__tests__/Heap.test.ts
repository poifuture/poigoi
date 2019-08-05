import Heap from "../Heap"

describe("Heap", () => {
  test("DefaultSortAscending", () => {
    const heap = new Heap([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    const result = []
    while (!heap.isEmpty()) {
      result.push(heap.poll())
    }
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  test("DefaultPeekSortAscending", () => {
    const heap = new Heap([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    const result = []
    while (!heap.isEmpty()) {
      result.push(heap.peek())
      heap.poll()
    }
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  test("CustomSortDescending", () => {
    const heap = new Heap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (a, b) => {
      if (a === b) {
        return 0
      }
      return b - a
    })
    const result = []
    while (!heap.isEmpty()) {
      result.push(heap.poll())
    }
    expect(result).toStrictEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })
  test("CustomObjectSortAscending", () => {
    const heap = new Heap(
      [{ i: 1, k: "a" }, { i: 2, k: "b" }, { i: 3, k: "a" }, { i: 4, k: "b" }],
      (a, b) => {
        if (a.k === b.k) {
          return 0
        }
        return a.k > b.k ? 1 : -1
      }
    )
    const result = []
    while (!heap.isEmpty()) {
      result.push(heap.poll())
    }
    expect(result[0]).toMatchObject({ k: "a" })
    expect(result[1]).toMatchObject({ k: "a" })
    expect(result[2]).toMatchObject({ k: "b" })
    expect(result[3]).toMatchObject({ k: "b" })
  })
})
