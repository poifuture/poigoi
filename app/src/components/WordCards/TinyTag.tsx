import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"

export interface TinyTagPropsType extends BoxProps {}
export class TinyTag extends React.Component<TinyTagPropsType> {
  render() {
    return (
      <Box
        display="inline-flex"
        border={1}
        borderRadius={3}
        marginLeft="5px"
        {...this.props}
      >
        {this.props.children}
      </Box>
    )
  }
}

export default TinyTag
