import React from "react"
import { GoiJaWordType } from "../../types/GoiDictionaryTypes"

export type WordCardPropsType = {
  word: GoiJaWordType
  display: "simple" | "detailed" | "test-common" | "test-translation"
  status:
    | "input"
    | "first"
    | "perfect"
    | "good"
    | "warning"
    | "failed"
    | "peek"
    | "review"
}

export class JaWordCard extends React.Component<WordCardPropsType> {
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
        : this.props.status === "perfect"
        ? "darkgreen"
        : this.props.status === "good"
        ? "lightgreen"
        : this.props.status === "warning"
        ? "yellow"
        : this.props.status === "failed"
        ? "red"
        : this.props.status === "peek"
        ? "blue"
        : this.props.status === "review"
        ? "black"
        : "black"
    return (
      <div className="word-card">
        {this.props.word.pos === "KANA" ? (
          <>
            <div className="word-card-common">
              {this.props.display !== "test-common" && (
                <span
                  dangerouslySetInnerHTML={{ __html: this.props.word.common }}
                ></span>
              )}
            </div>
            <div
              className="word-card-translation"
              style={{ color: statusColor }}
            >
              {this.props.word.translation.KanaDictionary.translation.ja}
            </div>
            <div className="word-card-sentences">
              {(this.props.word.sentences || []).map((sentence, sentenceId) => (
                <div key={sentenceId}>
                  <p>
                    <span
                      dangerouslySetInnerHTML={{ __html: sentence.sentence }}
                    ></span>
                  </p>
                  <p>
                    <span>{(sentence.translation || {}).zh}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    )
  }
}

export default JaWordCard
