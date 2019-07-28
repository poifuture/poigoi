import React from "react"
import WordCard from "./WordCard"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiJaWordType } from "../dictionary/GoiDictionary"
import { GlobalDbKey } from "../utils/PoiDb"
import * as PoiUser from "../utils/PoiUser"
import { GoiDb } from "../utils/GoiDb"
import { GoiUser, GoiUserModel, LocalGoiUsersDataType } from "../models/GoiUser"

export interface GoiCorePropsType {}

export interface GoiCoreStateType {
  currentWord: GoiJaWordType
  poiUserId: PoiUser.PoiUserId
  userDbKey: GlobalDbKey
  savingDbKey: GlobalDbKey
  saving: any
}

export class GoiCore extends React.Component<
  GoiCorePropsType,
  GoiCoreStateType
> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentWord: KanaDictionary.words["あ"],
      poiUserId: "",
      userDbKey: "",
      savingDbKey: "",
      saving: "",
    }
  }
  private lazyInitPoiUser = async (): Promise<PoiUser.PoiUserId> => {
    //tmp
    const localGoiUsers = await GoiDb().getOrNull<LocalGoiUsersDataType>(
      "Local/GoiUsers"
    )
    if (localGoiUsers) {
      if (localGoiUsers.Users && localGoiUsers.Users.length > 0) {
        return localGoiUsers.Users[0] as PoiUser.PoiUserId
      }
    }
    const poiUserId: PoiUser.PoiUserId = await PoiUser.GenerateId()
    await GoiUserModel.Create(poiUserId)
    return poiUserId
  }

  async componentDidMount() {
    const poiUserId = await this.lazyInitPoiUser()
    const userDbKey = await GoiUserModel.GetDbKey(poiUserId)
    const savingDbKey = await GoiUser(userDbKey).getDefaultSaving()
    const saving = await GoiDb().get(savingDbKey)
    this.setState({
      poiUserId: poiUserId,
      userDbKey: userDbKey,
      savingDbKey: savingDbKey,
      saving: saving,
    })
  }
  render() {
    return (
      <div className="goi-core">
        <input id="test-input"></input>
        <WordCard
          word={this.state.currentWord}
          display="detailed"
          status="success"
        />
        <pre className="goi-debug">
          {JSON.stringify(this.state.saving, null, 2)}
        </pre>
      </div>
    )
  }
}

export default GoiCore
