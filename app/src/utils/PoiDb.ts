export type TimeStamp = number & { readonly brand?: "PoiTimeStamp" }
export type Sha256String = string & { readonly brand?: "PoiSha256String" }
export type DbUuid = string & { readonly brand: "PoiDbUuid" }
export type DbSchema = string & { readonly brand?: "PoiDbSchema" }
export type DbKey = string & { readonly brand: "PoiDbKey" }
export type GlobalDbKey = DbKey & { readonly brand: "PoiGlobalDbKey" }
export type LocalDbKey = DbKey & { readonly brand: "PoiLocalDbKey" }
const local: LocalDbKey = "" as LocalDbKey
export interface RevType {
  Hash: Sha256String
  Time: TimeStamp
}
export interface PoiUniversialDataType {
  DbKey: DbKey
  DbSchema: DbSchema
}
export interface PoiGlobalDataType extends PoiUniversialDataType {
  DbKey: GlobalDbKey
  DbUuid: DbUuid
  LocalRev: RevType
  BaseRev: RevType
}
export interface PoiLocalDataType extends PoiUniversialDataType {
  DbKey: LocalDbKey
}
