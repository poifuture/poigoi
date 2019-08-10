import React from "react"
import LandingPage from "../containers/LandingPage"
import { withTranslation, WithTranslation } from "react-i18next"
import i18n from "i18next"
class ZhCnLandingPage extends React.Component<WithTranslation> {
  componentWillMount = async () => {
    await i18n.changeLanguage("zh-cn")
  }
  render() {
    return <LandingPage locale="zh-cn" hero="中文中国入口" />
  }
}
export default withTranslation("LandingPage")(ZhCnLandingPage)
