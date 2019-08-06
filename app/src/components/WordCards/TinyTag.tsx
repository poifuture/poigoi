import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"

export class TinyTag extends React.Component {
  render() {
    return (
      <Box
        display="inline-flex"
        border={1}
        borderRadius={3}
        marginLeft="5px"
        marginTop="5px"
        {...this.props}
      >
        {this.props.children}
      </Box>
    )
  }
}

export default TinyTag
