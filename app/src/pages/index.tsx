import React from "react"
import NavBar from "../components/NavBar"
import GoiJaTester from "../containers/GoiJaTester"

export default (props: any) => (
  <>
    <NavBar />
    <main>
      <GoiJaTester />
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
