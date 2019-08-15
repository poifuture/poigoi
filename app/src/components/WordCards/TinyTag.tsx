import React from "react"
import { I18nString } from "../../types/PoiI18nTypes"
import { List as MuiList, Box } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"

export interface TinyTagPropsType extends BoxProps {}
export class TinyTag extends React.Component<TinyTagPropsType> {
  render() {
    return (
      <Box
        display="inline-flex"
        fontSize="3vmin"
        height="auto"
        color="gray"
        marginLeft="4px"
        marginRight="1px"
        {...this.props}
      >
        {this.props.children}
      </Box>
    )
  }
}

export default TinyTag
