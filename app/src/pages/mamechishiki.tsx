import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { poisky3 } from "../utils/PoiColors"

const Card = styled.div``
const CardHeader = styled.div`
  background: ${poisky3};
`
const CardBody = styled.div``

export default (props: any) => (
  <div>
    <NavBar />
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
    {props.data.allMarkdownRemark.edges.map((edge: any) => (
      <Card key={edge.node.id}>
        <CardHeader>{edge.node.frontmatter.title}</CardHeader>
        <CardBody dangerouslySetInnerHTML={{ __html: edge.node.html }} />
      </Card>
    ))}
  </div>
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
