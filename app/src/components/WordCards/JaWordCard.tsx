import React from "react"
import { GoiJaWordType } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import GoiTranslation from "./GoiTranslation"
import TinyTag from "./TinyTag"
import GoiSentence from "./GoiSentence"

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
  dictionarys: string[]
  level: number
}

const circledNumber = (x: number) => {
  if (x === 0) {
    return String.fromCharCode(9450)
  }
  if (x >= 1 && x < 20) {
    return String.fromCharCode(9311 + Math.floor(x))
  }
  return ""
}
export class JaWordCard extends React.Component<WordCardPropsType> {
  static defaultProps = {
    word: {
      common: "Common Placeholder",
      translation: "Translation Placeholder",
    },
    display: "detailed",
    status: "view",
    dictionarys: [
      "KanaDictionary",
      "GoiSimpleJaDictionary",
      "BiaozhunRibenyu",
      "XinbianRiyu",
      "Xinbian",
      "AnimeSong",
      "Anime",
      "JishoOrg",
      "GooJisho",
    ],
    level: -1,
  }
  render() {
    const statusColor =
      this.props.status === "input"
        ? "gray"
        : this.props.status === "first"
        ? "blue"
        : this.props.status === "perfect"
        ? "green"
        : this.props.status === "good"
        ? "lightgreen"
        : this.props.status === "warning"
        ? "orange"
        : this.props.status === "failed"
        ? "red"
        : this.props.status === "peek"
        ? "blue"
        : this.props.status === "review"
        ? "black"
        : "black"
    const word = Object.assign({}, this.props.word)
    const sortedTranslationsDictionarys = []
    for (let i = 0; i < this.props.dictionarys.length; i++) {
      const tmpDictionary = this.props.dictionarys[i]
      if (Object.keys(word.translations).includes(tmpDictionary)) {
        sortedTranslationsDictionarys.push(tmpDictionary)
      }
    }
    const filteredTranslationsDictionarys =
      this.props.display !== "detailed"
        ? sortedTranslationsDictionarys.slice(0, 1)
        : sortedTranslationsDictionarys
    const sortedSentences = []
    for (let i = 0; i < this.props.dictionarys.length; i++) {
      const tmpDictionary = this.props.dictionarys[i]
      const tmpSentences = (word.sentences || []).filter(
        sentence => sentence.from === tmpDictionary
      )
      sortedSentences.push(...tmpSentences)
    }
    const filteredSentences =
      this.props.display !== "detailed"
        ? sortedSentences.slice(0, 1)
        : sortedSentences
    console.debug(filteredTranslationsDictionarys, filteredSentences)
    return (
      <div className="word-card">
        <div
          className="word-card-common"
          style={{
            height: "20vmin",
            fontSize: "10vmin",
            color: statusColor,
            visibility:
              this.props.display === "test-common" ? "hidden" : "inherit",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: word.common }} />
        </div>
        <div
          className="word-card-tags"
          style={{
            visibility:
              this.props.display === "test-common" ? "hidden" : "inherit",
          }}
        >
          {typeof word.tone === "number" && circledNumber(word.tone)}
          {Array.isArray(word.tone) &&
            word.tone
              .map(
                singleTone =>
                  typeof singleTone === "number" && circledNumber(singleTone)
              )
              .join()}
          {word.pos.includes("KANA") && <TinyTag>仮名</TinyTag>}
          {word.pos.includes("HIRAGANA") && <TinyTag>平仮名</TinyTag>}
          {word.pos.includes("KATAKANA") && <TinyTag>片仮名</TinyTag>}
          {word.pos.includes("VERB") && <TinyTag>動詞</TinyTag>}
          {word.pos.includes("GODAN") && <TinyTag>五段活用</TinyTag>}
          {word.pos.includes("JIDOSHI") && <TinyTag>自動詞</TinyTag>}
          {word.pos.includes("TADOSHI") && <TinyTag>他動詞</TinyTag>}
          {word.pos.includes("NOUN") && <TinyTag>名詞</TinyTag>}
          {word.romaji && (
            <>
              <TinyTag>ローマ字</TinyTag>
              {word.romaji}
            </>
          )}
          {word.wapuro && (
            <>
              <TinyTag>ワープロ</TinyTag>
              {word.wapuro}
            </>
          )}
        </div>
        <div className="word-card-translation" style={{ color: statusColor }}>
          <MuiList>
            {filteredTranslationsDictionarys.map(dictionaryName => (
              <GoiTranslation
                key={dictionaryName}
                i18nTranslation={word.translations[dictionaryName]}
                displayHint={this.props.display !== "test-common"}
                from={dictionaryName}
                displayFrom={this.props.display === "detailed"}
              />
            ))}
          </MuiList>
        </div>
        {this.props.display !== "test-common" && (
          <div className="word-card-sentences">
            <MuiList>
              {filteredSentences.map((sentence, sentenceId) => (
                <GoiSentence
                  key={sentenceId}
                  i18nSentence={sentence}
                  displayFrom={this.props.display === "detailed"}
                />
              ))}
            </MuiList>
          </div>
        )}
        {this.props.display === "detailed" && (
          <div className="word-card-textbooks">
            {word.textbook.map((textbook, textbookId) => (
              <TinyTag key={textbookId}>{textbook}</TinyTag>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default JaWordCard
