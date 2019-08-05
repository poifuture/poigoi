// Copy from https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/heap/Heap.js

export default class Heap<T> {
  heapContainer: T[] = []
  compareFn: (a: T, b: T) => number

  constructor(array: T[], compareFn?: (a: T, b: T) => number) {
    this.heapContainer = [...array]
    this.compareFn = compareFn
      ? compareFn
      : (a, b) => {
          if (a === b) {
            return 0
          }
          return a < b ? -1 : 1
        }
    for (
      let itemIndex = this.heapContainer.length - 1;
      itemIndex >= 0;
      itemIndex--
    ) {
      this.heapifyDown(itemIndex)
    }
  }

  getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1
  }

  getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2
  }

  getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2)
  }

  hasParent(childIndex: number): boolean {
    return this.getParentIndex(childIndex) >= 0
  }

  hasLeftChild(parentIndex: number): boolean {
    return this.getLeftChildIndex(parentIndex) < this.heapContainer.length
  }

  hasRightChild(parentIndex: number): boolean {
    return this.getRightChildIndex(parentIndex) < this.heapContainer.length
  }

  leftChild(parentIndex: number): T {
    return this.heapContainer[this.getLeftChildIndex(parentIndex)]
  }

  rightChild(parentIndex: number): T {
    return this.heapContainer[this.getRightChildIndex(parentIndex)]
  }

  parent(childIndex: number): T {
    return this.heapContainer[this.getParentIndex(childIndex)]
  }

  swap(indexOne: number, indexTwo: number) {
    const tmp = this.heapContainer[indexTwo]
    this.heapContainer[indexTwo] = this.heapContainer[indexOne]
    this.heapContainer[indexOne] = tmp
  }

  peek(): T | null {
    if (this.heapContainer.length === 0) {
      return null
    }
    return this.heapContainer[0]
  }

  poll(): T | null {
    if (this.heapContainer.length === 0) {
      return null
    }

    if (this.heapContainer.length === 1) {
      return this.heapContainer.pop()!
    }

    const item = this.heapContainer[0]

    // Move the last element from the end to the head.
    this.heapContainer[0] = this.heapContainer.pop()!
    this.heapifyDown()

    return item
  }

  add(item: T): this {
    this.heapContainer.push(item)
    this.heapifyUp()
    return this
  }

  remove(matchFn: (item: T) => unknown): this {
    // Find number of items to remove.
    const numberOfItemsToRemove = this.match(matchFn).length

    for (let iteration = 0; iteration < numberOfItemsToRemove; iteration += 1) {
      // We need to find item index to remove each time after removal since
      // indices are being changed after each heapify process.
      const indexToRemove = this.match(matchFn).pop()!

      // If we need to remove last child in the heap then just remove it.
      // There is no need to heapify the heap afterwards.
      if (indexToRemove === this.heapContainer.length - 1) {
        this.heapContainer.pop()
      } else {
        // Move last element in heap to the vacant (removed) position.
        this.heapContainer[indexToRemove] = this.heapContainer.pop()!

        // Get parent.
        const parentItem = this.parent(indexToRemove)

        // If there is no parent or parent is in correct order with the node
        // we're going to delete then heapify down. Otherwise heapify up.
        if (
          this.hasLeftChild(indexToRemove) &&
          (!parentItem ||
            this.pairIsInCorrectOrder(
              parentItem,
              this.heapContainer[indexToRemove]
            ))
        ) {
          this.heapifyDown(indexToRemove)
        } else {
          this.heapifyUp(indexToRemove)
        }
      }
    }

    return this
  }

  find(item: T, compareFn = this.compareFn): number[] {
    const foundItemIndices = []
    for (
      let itemIndex = 0;
      itemIndex < this.heapContainer.length;
      itemIndex += 1
    ) {
      if (compareFn(item, this.heapContainer[itemIndex]) === 0) {
        foundItemIndices.push(itemIndex)
      }
    }
    return foundItemIndices
  }
  match(matchFn: (item: T) => unknown): number[] {
    const foundItemIndices = []
    for (
      let itemIndex = 0;
      itemIndex < this.heapContainer.length;
      itemIndex += 1
    ) {
      if (matchFn(this.heapContainer[itemIndex])) {
        foundItemIndices.push(itemIndex)
      }
    }
    return foundItemIndices
  }

  isEmpty(): boolean {
    return !this.heapContainer.length
  }

  toString(): string {
    return this.heapContainer.toString()
  }

  heapifyUp(customStartIndex?: number) {
    // Take the last element (last in array or the bottom left in a tree)
    // in the heap container and lift it up until it is in the correct
    // order with respect to its parent element.
    let currentIndex = customStartIndex || this.heapContainer.length - 1

    while (
      this.hasParent(currentIndex) &&
      !this.pairIsInCorrectOrder(
        this.parent(currentIndex),
        this.heapContainer[currentIndex]
      )
    ) {
      this.swap(currentIndex, this.getParentIndex(currentIndex))
      currentIndex = this.getParentIndex(currentIndex)
    }
  }

  heapifyDown(customStartIndex: number = 0) {
    // Compare the parent element to its children and swap parent with the appropriate
    // child (smallest child for MinHeap, largest child for MaxHeap).
    // Do the same for next children after swap.
    let currentIndex = customStartIndex
    let nextIndex = null

    while (this.hasLeftChild(currentIndex)) {
      if (
        this.hasRightChild(currentIndex) &&
        this.pairIsInCorrectOrder(
          this.rightChild(currentIndex),
          this.leftChild(currentIndex)
        )
      ) {
        nextIndex = this.getRightChildIndex(currentIndex)
      } else {
        nextIndex = this.getLeftChildIndex(currentIndex)
      }

      if (
        this.pairIsInCorrectOrder(
          this.heapContainer[currentIndex],
          this.heapContainer[nextIndex]
        )
      ) {
        break
      }

      this.swap(currentIndex, nextIndex)
      currentIndex = nextIndex
    }
  }

  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   */
  pairIsInCorrectOrder(firstElement: T, secondElement: T): boolean {
    // return this.compare.lessThanOrEqual(firstElement, secondElement)
    return this.compareFn(firstElement, secondElement) <= 0
  }
}
