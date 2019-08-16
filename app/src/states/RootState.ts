import { GoiTesterStateReducedType } from "./GoiTesterState"
import { GoiUserStateReducedType } from "./GoiUserState"
import { GoiSavingStateReducedType } from "./GoiSavingState"
import { GoiSettingsStateReducedType } from "./GoiSettingsState"
import { WordAdderStateReducedType } from "./WordAdderState"
import { LayoutStateReducedType } from "./LayoutState"

export interface RootStateType {
  GoiTester: GoiTesterStateReducedType
  GoiUser: GoiUserStateReducedType
  GoiSettings: GoiSettingsStateReducedType
  GoiSaving: GoiSavingStateReducedType
  WordAdder: WordAdderStateReducedType
  Layout: LayoutStateReducedType
}
