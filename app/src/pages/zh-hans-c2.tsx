import React from "react"
import LandingPage from "../containers/LandingPage"
import { withTranslation, WithTranslation } from "react-i18next"
import i18n from "i18next"
class ZhHansC2LandingPage extends React.Component<WithTranslation> {
  componentWillMount = async () => {
    await i18n.changeLanguage("zh-hans-c2")
  }
  render() {
    return (
      <LandingPage
        locale="zh-hans-c2"
        hero="中二病入口，界面语言满满的中二风"
      />
    )
  }
}
export default withTranslation("LandingPage")(ZhHansC2LandingPage)
