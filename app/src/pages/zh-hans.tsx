import React from "react"
import LandingPage from "../containers/LandingPage"
import { withTranslation, WithTranslation } from "react-i18next"
import i18n from "i18next"
class ZhCnLandingPage extends React.Component<WithTranslation> {
  constructor(props: WithTranslation) {
    super(props)
    i18n.language = "zh-hans"
  }
  componentDidMount = async () => {
    await i18n.changeLanguage("zh-hans")
  }
  render() {
    return <LandingPage locale="zh-hans" hero="中文中国入口" />
  }
}
export default withTranslation("LandingPage")(ZhCnLandingPage)
