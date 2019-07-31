import React from "react"
import NavBar from "../components/NavBar"
import GoiJaTester from "../containers/GoiJaTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"

export default (props: any) => (
  <>
    <NavBar />
    <main>
      <CommandsBar />
      <WordAdder />
      <GoiJaTester />
    </main>
    <section className="tools">
      <button>Add New Words</button>
    </section>
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
