import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"

export default (props: any) => (
  // <div style={{ width: "100%", overflow: "hidden", position: "fixed" }}>
  <div
    style={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "fixed",
    }}
  >
    <NavBar />
    <CommandsBar />
    <main>
      <Container>
        <WordAdder />
        <GoiTester />
      </Container>
    </main>
    <footer>
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
        まります ٩(ˊᗜˋ*)و
      </Container>
    </footer>
  </div>
)
