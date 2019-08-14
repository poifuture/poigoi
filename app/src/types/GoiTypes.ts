export type GoiSavingId = string & { readonly brand: "GoiSavingId" }

export type GoiJudgeResult =
  | "Pending"
  | "Correct"
  | "Accepted"
  | "Rejected"
  | "Wrong"
  | "Skipped"
  | "Forced"

export interface AllPromisesReceiver {
  <T>(allPromise: Promise<unknown>[]): T | void
}
