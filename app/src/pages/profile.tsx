import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import ProfileContainer from "../containers/ProfileContainer"

export class ProfilePage extends React.Component {
  surveyIFrame: React.RefObject<HTMLIFrameElement>
  constructor(props: any) {
    super(props)
    this.surveyIFrame = React.createRef()
  }
  resizeSurveyIFrame = () => {
    const surveyIframe = this.surveyIFrame.current
    if (!surveyIframe) {
      return
    }
    const surveyWindow = surveyIframe.contentWindow
    if (!surveyWindow) {
      return
    }
    // const surveyHeight = surveyWindow.outerHeight
    // surveyIframe.height = surveyHeight + "px"
  }
  render() {
    return (
      <div className="goi-profile-page">
        <NavBar />
        <main>
          <Container>
            <ProfileContainer />
          </Container>
        </main>
      </div>
    )
  }
}
export default ProfilePage
