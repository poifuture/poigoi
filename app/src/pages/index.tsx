import React from "react"
import NavBar from "../components/NavBar"
import GoiCore from "../components/GoiCore"
import "./goi.css"

export default (props: any) => (
  <>
    <NavBar />
    <main>
      <GoiCore />
    </main>
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
  </>
)
