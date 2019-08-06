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
  </div>
)
