import * as PoiUser from "../utils/PoiUser"
import { GoiUserDbKey } from "../models/GoiUser"

export type GoiUserDomainType = "Local" | "Global"

export interface GoiUserStateType {
  PoiUserId: PoiUser.PoiUserId
  Domain: GoiUserDomainType
  UserDbKey: GoiUserDbKey
}
