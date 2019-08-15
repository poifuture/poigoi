import React from "react"
import { I18nString } from "../../types/PoiI18nTypes"
import { List as MuiList, Box } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"

export class GoiUnorderedList extends React.Component {
  render() {
    return (
      <ul style={{ listStyle: "none", padding: 0 }} {...this.props}>
        {this.props.children}
      </ul>
    )
  }
}

export default GoiUnorderedList
