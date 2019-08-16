declare module "collections/sorted-array" {
  type CompareFunction<T> = (a: T, b: T) => number
  type EqualsFunction<T> = (a: T, b: T) => boolean
  class SortedArray<T> {
    constructor(
      values?: T[],
      equals?: EqualsFunction<T>,
      compare?: CompareFunction<T>
    )
    length: number
    push(...values: T[])
    add(value: T)
    shift(): T
    min(): T
    one(): T | undefined
    delete(value: T)
    slice(start: number, end: number): T[]
    deleteAll(value: T, euqals: EqualsFunction<T>): number
  }
  export default SortedArray
}
