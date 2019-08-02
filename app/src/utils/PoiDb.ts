export type TimeStamp = number & { readonly brand?: "PoiTimeStamp" }
export type Sha256String = string & { readonly brand?: "PoiSha256String" }
export type DbUuid = string & { readonly brand: "PoiDbUuid" }
export type DbSchema = string & { readonly brand?: "PoiDbSchema" }
export type DbKey = string & { readonly brand: "PoiDbKey" }
export type GlobalDbKey = DbKey & { readonly brand: "PoiGlobalDbKey" }
export type LocalDbKey = DbKey & { readonly brand: "PoiLocalDbKey" }

export interface RevType {
  Hash: Sha256String
  Time: TimeStamp
}
export interface PoiUniversialDataType {
  readonly DbKey: DbKey
  readonly DbSchema: DbSchema
}
export interface PoiGlobalDataType extends PoiUniversialDataType {
  readonly DbKey: GlobalDbKey
  readonly DbUuid: DbUuid
  LocalRev: RevType
  BaseRev: RevType
}
export interface PoiLocalDataType extends PoiUniversialDataType {
  readonly DbKey: LocalDbKey
}
