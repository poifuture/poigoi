import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"

export default (props: any) => (
  // <div style={{ width: "100%", overflow: "hidden", position: "fixed" }}>
  <div
    className="goi-index-page"
    style={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "fixed",
    }}
  >
    <Hidden xsDown>
      <NavBar />
    </Hidden>
    <CommandsBar />
    <main>
      <WordAdder />
      <Container>
        <GoiTester />
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
        がここから
        <ruby>
          始<rt>はじ</rt>
        </ruby>
        まりましょう ٩(ˊᗜˋ*)و
      </Container>
    </footer>
  </div>
)
