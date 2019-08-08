import React from "react"
import { useMediaQuery, useTheme } from "@material-ui/core"
import Dialog, { DialogProps } from "@material-ui/core/Dialog"
import { isWidthDown } from "@material-ui/core/withWidth"

const ResponsiveDialog = (props: DialogProps) => {
  const smDown = useMediaQuery(useTheme().breakpoints.down("xs"))
  // return (
  //   <Dialog {...props} fullScreen={smDown}>
  //     {props.children}
  //   </Dialog>
  // )
  return (
    <Dialog {...props} PaperProps={{ style: { margin: "10px" } }}>
      {props.children}
    </Dialog>
  )
}

export default ResponsiveDialog
