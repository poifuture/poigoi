import React from "react"
import { GoiJaWordType } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import GoiTranslation from "./GoiTranslation"
import TinyTag from "./TinyTag"
import TinyContentTag from "./TinyContentTag"
import GoiSentence from "./GoiSentence"
import BatteryUnknownIcon from "@material-ui/icons/BatteryUnknownOutlined"
import BatteryCharging20Icon from "@material-ui/icons/BatteryCharging20Outlined"
import BatteryCharging30Icon from "@material-ui/icons/BatteryCharging30Outlined"
import BatteryCharging50Icon from "@material-ui/icons/BatteryCharging50Outlined"
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60Outlined"
import BatteryCharging80Icon from "@material-ui/icons/BatteryCharging80Outlined"
import BatteryCharging90Icon from "@material-ui/icons/BatteryCharging90Outlined"
import BatteryChargingFullIcon from "@material-ui/icons/BatteryChargingFullOutlined"
import BatteryAlertIcon from "@material-ui/icons/BatteryAlertOutlined"
import VolumeOffIcon from "@material-ui/icons/VolumeOffOutlined"
import DebugModule from "debug"
import GoiUnorderedList from "./GoiUnorderedList"
const debug = DebugModule("PoiGoi:JaWordCard")

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
    const { level } = this.props
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
    debug(filteredTranslationsDictionarys, filteredSentences)
    return (
      <div className="word-card">
        <div
          className="word-card-common"
          style={{
            minHeight: "20vmin",
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
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              visibility:
                this.props.display === "test-common" ? "hidden" : "inherit",
            }}
          >
            <VolumeOffIcon fontSize="small" />
            {typeof word.tone === "number" && circledNumber(word.tone)}
            {Array.isArray(word.tone) &&
              word.tone
                .map(
                  singleTone =>
                    typeof singleTone === "number" && circledNumber(singleTone)
                )
                .join()}
            {level === 0 ? (
              <BatteryUnknownIcon fontSize="small" />
            ) : level === 1 ? (
              <BatteryCharging20Icon fontSize="small" />
            ) : level === 2 ? (
              <BatteryCharging30Icon fontSize="small" />
            ) : level === 3 ? (
              <BatteryCharging50Icon fontSize="small" />
            ) : level === 4 ? (
              <BatteryCharging60Icon fontSize="small" />
            ) : level === 5 ? (
              <BatteryCharging80Icon fontSize="small" />
            ) : level === 6 ? (
              <BatteryCharging90Icon fontSize="small" />
            ) : level >= 7 ? (
              <BatteryChargingFullIcon fontSize="small" />
            ) : (
              <BatteryAlertIcon fontSize="small" />
            )}
          </div>
          <span
            style={{
              visibility:
                this.props.display === "test-common" ? "hidden" : "inherit",
            }}
          >
            <div>
              {word.romaji && (
                <TinyContentTag title="ローマ字:">{word.romaji}</TinyContentTag>
              )}
              {word.wapuro && (
                <TinyContentTag title="ワープロ:">{word.wapuro}</TinyContentTag>
              )}
            </div>
            <div>
              {word.alternatives.length > 0 && (
                <TinyContentTag title="同:">
                  {word.alternatives.map(furigana => (
                    <span dangerouslySetInnerHTML={{ __html: furigana }} />
                  ))}
                </TinyContentTag>
              )}
              {word.uncommons.length > 0 && (
                <TinyContentTag title="珍:">
                  {word.uncommons.map(furigana => (
                    <span dangerouslySetInnerHTML={{ __html: furigana }} />
                  ))}
                </TinyContentTag>
              )}
            </div>
            <div>
              {word.pos.includes("KANA") && <TinyTag>仮名</TinyTag>}
              {word.pos.includes("HIRAGANA") && <TinyTag>平仮名</TinyTag>}
              {word.pos.includes("KATAKANA") && <TinyTag>片仮名</TinyTag>}
              {word.pos.includes("DAKUON") && <TinyTag>濁音</TinyTag>}
              {word.pos.includes("YOON") && <TinyTag>拗音</TinyTag>}
              {word.pos.includes("CHOON") && <TinyTag>長音</TinyTag>}
              {word.pos.includes("VERB") && <TinyTag>動詞</TinyTag>}
              {word.pos.includes("GODAN") && <TinyTag>五段活用</TinyTag>}
              {word.pos.includes("KAMIICHIDAN") && (
                <TinyTag>上一段活用</TinyTag>
              )}
              {word.pos.includes("SHIMOICHIDAN") && (
                <TinyTag>下一段活用</TinyTag>
              )}
              {word.pos.includes("SAHEN") && <TinyTag>サ変</TinyTag>}
              {word.pos.includes("KAHEN") && <TinyTag>カ変</TinyTag>}
              {word.pos.includes("JIDOSHI") && <TinyTag>自動詞</TinyTag>}
              {word.pos.includes("TADOSHI") && <TinyTag>他動詞</TinyTag>}
              {word.pos.includes("ADJ") && <TinyTag>形容詞</TinyTag>}
              {word.pos.includes("KEIYODOSHI") && <TinyTag>形容動詞</TinyTag>}
              {word.pos.includes("NOUN") && <TinyTag>名詞</TinyTag>}
              {word.pos.includes("PROPER") && <TinyTag>固有名詞</TinyTag>}
              {word.pos.includes("PRON") && <TinyTag>代名詞</TinyTag>}
              {word.pos.includes("RENTAISHI") && <TinyTag>連体詞</TinyTag>}
              {word.pos.includes("ADV") && <TinyTag>副詞</TinyTag>}
              {word.pos.includes("CONJ") && <TinyTag>接続詞</TinyTag>}
              {word.pos.includes("INTERJ") && <TinyTag>感動詞</TinyTag>}
              {word.pos.includes("JODOSHI") && <TinyTag>助動詞</TinyTag>}
              {word.pos.includes("JOSHI") && <TinyTag>助詞</TinyTag>}
              {word.pos.includes("IDIOM") && <TinyTag>熟語</TinyTag>}
              {level >= 0 && <TinyTag>練度{level}</TinyTag>}
            </div>
          </span>
        </div>
        <div className="word-card-translation" style={{ color: statusColor }}>
          <GoiUnorderedList>
            {filteredTranslationsDictionarys.map(dictionaryName => (
              <GoiTranslation
                key={dictionaryName}
                i18nTranslation={word.translations[dictionaryName]}
                displayHint={this.props.display !== "test-common"}
                from={dictionaryName}
                displayFrom={this.props.display === "detailed"}
              />
            ))}
          </GoiUnorderedList>
        </div>
        {this.props.display !== "test-common" && (
          <div className="word-card-sentences">
            <GoiUnorderedList>
              {filteredSentences.map((sentence, sentenceId) => (
                <GoiSentence
                  key={sentenceId}
                  i18nSentence={sentence}
                  displayFrom={this.props.display === "detailed"}
                />
              ))}
            </GoiUnorderedList>
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
