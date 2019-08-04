import { GoiTesterStateReducedType } from "./GoiTesterState"
import { GoiUserStateReducedType } from "./GoiUserState"
import { GoiSavingStateReducedType } from "./GoiSavingState"
import { WordAdderStateReducedType } from "./WordAdderState"

export interface RootStateType {
  GoiTester: GoiTesterStateReducedType
  GoiUser: GoiUserStateReducedType
  GoiSaving: GoiSavingStateReducedType
  WordAdder: WordAdderStateReducedType
}
