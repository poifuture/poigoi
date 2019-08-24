import React from "react"
import { graphql } from "gatsby"
import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { poisky3 } from "../utils/PoiColors"
import Helmet from "react-helmet"
import { Container } from "@material-ui/core"


export default (props: any) => (
  <div>
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
      <div key={edge.node.id}>
        <div style={{ backgroundColor: poisky3 }}>
          <Container>{edge.node.frontmatter.title}</Container>
        </div>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: edge.node.html }} />
        </Container>
      </div>
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
