import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { poisky3 } from "../utils/PoiColors"
import Helmet from "react-helmet"
import { Container } from "@material-ui/core"

const Card = styled.div``
const CardHeader = styled.div`
  background: ${poisky3};
`
const CardBody = styled.div``

export default (props: any) => (
  <>
    <Helmet>
      <title>Mamechishiki</title>
    </Helmet>
    <NavBar />
    <Container>
      <Header>
        <ruby>
          豆<rt>まめ</rt>
        </ruby>
        <ruby>
          知<rt>ち</rt>
        </ruby>
        <ruby>
          識<rt>しき</rt>
        </ruby>
      </Header>
    </Container>
    {props.data.allMarkdownRemark.edges.map((edge: any) => (
      <Card key={edge.node.id}>
        <CardHeader>
          <Container>{edge.node.frontmatter.title}</Container>
        </CardHeader>
        <Container>
          <CardBody dangerouslySetInnerHTML={{ __html: edge.node.html }} />
        </Container>
      </Card>
    ))}
  </>
)

export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
          }
          html
        }
      }
    }
  }
`
