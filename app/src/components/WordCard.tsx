import React from "react"
import { GoiJaWordType } from "../types/GoiDictionaryTypes"

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
            <pre className="word-card-debug">
              {JSON.stringify(this.props.word, null, 2)}
            </pre>
          </>
        ) : (
          <></>
        )}
      </div>
    )
  }
}

export default WordCard
