import React from "react"
import LandingPage from "../containers/LandingPage"
import { withTranslation, WithTranslation } from "react-i18next"
import i18n from "i18next"
class ZhLandingPage extends React.Component<WithTranslation> {
  componentWillMount = async () => {
    await i18n.changeLanguage("zh")
  }
  render() {
    return (
      <LandingPage locale="zh" hero="中文Onboarding 页面，为百度SEO优化制作" />
    )
  }
}
export default withTranslation("LandingPage")(ZhLandingPage)
