import * as PoiUser from "../utils/PoiUser"

export type GoiUserDomainType = "Local" | "Poi"

export interface GoiUserStateType {
  PoiUserId: PoiUser.PoiUserId
  Domain: GoiUserDomainType
}
