import React from "react"
import Header from "../components/Header"
import NavBar from "../components/NavBar"
import Helmet from "react-helmet"
import { Container } from "@material-ui/core"

export default () => (
  <div>
    <Helmet>
      <title>Tegami</title>
    </Helmet>
    <NavBar />
    <Container>
      <Header>
        [WIP]
        <ruby>
          作<rt>さく</rt>
        </ruby>
        <ruby>
          者<rt>しゃ</rt>
        </ruby>
        の
        <ruby>
          手<rt>て</rt>
        </ruby>
        <ruby>
          紙<rt>がみ</rt>
        </ruby>
      </Header>
      <p>
        みんなぁぁぁ～～～
        <ruby>
          初<rt>はじ</rt>
        </ruby>
        めまして、
        <ruby>
          凪<rt>なぎ</rt>
        </ruby>
        です、よろしくね～
      </p>
    </Container>
    <footer style={{ position: "fixed", bottom: 0 }}>
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
