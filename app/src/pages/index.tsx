import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"

export default (props: any) => (
  <>
    <NavBar />
    <main>
      <CommandsBar />
      <WordAdder />
      <GoiTester />
    </main>
    <footer>
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
    </footer>
  </>
)
