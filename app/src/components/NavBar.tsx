import React, { useState } from "react"
import { Link } from "gatsby"
import { poisky, poisky5 } from "../utils/PoiColors"
import Container from "@material-ui/core/Container"



function NavBarItem(props: any) {
  const [hover, setHover] = useState(false)
  return <li style={{ float: "left" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
    <Link style={{ display: "block", color: "white", textAlign: "center", padding: "14px 16px", textDecoration: "none", backgroundColor: hover ? poisky5 : "" }} replace {...props} />
  </li>
}

export default () => (
  <nav style={{
    top: 0,
    left: 0,
    width: "100%"
  }}>
    <ul
      style={{ listStyleType: "none", margin: 0, padding: 0, overflow: "hidden", backgroundColor: poisky, }}
    >
      <Container>
        <NavBarItem to="/">Study</NavBarItem>
        <NavBarItem to="/mamechishiki/">豆知識</NavBarItem>
        <NavBarItem to="/tegami/">手紙</NavBarItem>
      </Container>
    </ul>
  </nav>
)
