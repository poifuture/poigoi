import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"
import TinyTag from "./TinyTag"

export interface TinyContentTagPropsType {
  title: string
}
export class TinyContentTag extends React.Component<TinyContentTagPropsType> {
  render() {
    return (
      <div
        style={{
          flexWrap: "nowrap",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <div style={{ height: "auto" }}>
          <TinyTag>{this.props.title}</TinyTag>
        </div>
        <span style={{ fontSize: "4vmin", color: "gray" }}>
          {this.props.children}
        </span>
      </div>
    )
  }
}

export default TinyContentTag
