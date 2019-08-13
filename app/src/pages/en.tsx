import React from "react"
import LandingPage from "../containers/LandingPage"
import { withTranslation, WithTranslation } from "react-i18next"
import i18n, { WithT } from "i18next"

class ZhCnLandingPage extends React.Component<WithTranslation> {
  constructor(props: WithTranslation) {
    super(props)
    i18n.language = "en"
  }
  componentDidMount = async () => {
    await i18n.changeLanguage("en")
  }
  render() {
    return (
      <LandingPage
        locale="en"
        hero="Landing page for english locale. This page is used to improve the visibility of the app from Google."
      />
    )
  }
}
export default withTranslation("LandingPage")(ZhCnLandingPage)
