import * as PoiUser from "../utils/PoiUser"

export type GoiUserDomainType = "Local" | "Global"

export interface GoiUserStateType {
  PoiUserId: PoiUser.PoiUserId
  Domain: GoiUserDomainType
}
