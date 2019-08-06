import Immutable from "immutable"

export interface LayoutStateType {
  DisplayNavBar: boolean
}

export interface LayoutStateReducedType extends Immutable.Map<string, any> {}
