import React from "react"
import { GoiJaWordType } from "../dictionary/GoiDictionary"

export type WordCardPropsType = {
  word: GoiJaWordType
  display: "simple" | "detailed" | "test-common" | "test-translation"
  status: "input" | "first" | "success" | "failed" | "peek" | "review"
}

export class WordCard extends React.Component<WordCardPropsType> {
  static defaultProps = {
    word: {
      common: "Common Placeholder",
      translation: "Translation Placeholder",
    },
    display: "detailed",
    status: "view",
  }
  render() {
    const statusColor =
      this.props.status === "input"
        ? "gray"
        : this.props.status === "first"
        ? "blue"
        : this.props.status === "success"
        ? "green"
        : this.props.status === "failed"
        ? "red"
        : this.props.status === "peek"
        ? "blue"
        : this.props.status === "review"
        ? "black"
        : "black"
    return this.props.word.pos === "KANA" ? (
      <div className="word-card">
        <h1>
          {this.props.display !== "test-common" && (
            <span
              dangerouslySetInnerHTML={{ __html: this.props.word.common }}
            ></span>
          )}
        </h1>
        <div style={{ color: statusColor }}>
          {this.props.word.translation.KanaDictionary.translation.ja}
        </div>
      </div>
    ) : (
      <div className="word-card"></div>
    )
  }
}

export default WordCard
