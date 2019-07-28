import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import { poisky, poisky5 } from "../utils/PoiColors"

const NavBar = styled.nav`
  top: 0;
  left: 0;
  width: 100%;
`
const NavBarList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: ${poisky};
`

const NavBarLink = styled(Link)`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;

  :hover {
    background-color: ${poisky5};
  }
`

const UnstyledNavBarItem = (props: any) => (
  <li>
    <NavBarLink {...props} />
  </li>
)

const NavBarItem = styled(UnstyledNavBarItem)`
  float: left;
`

export default () => (
  <NavBar>
    <Helmet>
      <title>PoiGoi</title>
    </Helmet>
    <NavBarList>
      <NavBarItem to="/">Home</NavBarItem>
      <NavBarItem to="/mamechishiki/">豆知識</NavBarItem>
      <NavBarItem to="/tegami/">手紙</NavBarItem>
    </NavBarList>
  </NavBar>
)
