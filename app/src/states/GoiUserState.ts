import Immutable from "immutable"
import * as PoiUser from "../utils/PoiUser"

export type GoiUserDomainType = "Local" | "Poi"

export interface GoiUserStateType {
  PoiUserId: PoiUser.PoiUserId
  Domain: GoiUserDomainType
  PouchDbPassword: string
}

export interface GoiUserStateReducedType extends Immutable.Map<string, any> {}
