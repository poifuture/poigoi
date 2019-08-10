import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import { poisky } from "../utils/PoiColors"
import { height } from "@material-ui/system"

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
    <Hidden smUp>
      <div style={{ background: poisky, height: "1px" }} />
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
        をここから
        <ruby>
          始<rt>はじ</rt>
        </ruby>
        めましょう ٩(ˊᗜˋ*)و
      </Container>
    </footer>
  </div>
)
