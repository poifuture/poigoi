import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import ProfileContainer from "../containers/ProfileContainer"

export default (props: any) => (
  // <div style={{ width: "100%", overflow: "hidden", position: "fixed" }}>
  <div className="goi-profile-page">
    <NavBar />
    <main>
      <Container>
        <ProfileContainer />
      </Container>
    </main>
    <footer style={{ position: "absolute", bottom: 0 }}>
      <Container>
        <ruby>
          私<rt>わたし</rt>
        </ruby>
        たちの
        <ruby>
          夢<rt>ゆめ</rt>
        </ruby>
        をここから
        <ruby>
          始<rt>はじ</rt>
        </ruby>
        めましょう ٩(ˊᗜˋ*)و
      </Container>
    </footer>
  </div>
)
