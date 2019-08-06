import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import TinyTag from "./TinyTag"

export type GoiSentencePropsType = {
  i18nSentence: {
    from: string
    sentence: string
    audios?: { cv: string; wav: string }[]
    translation?: I18nString
    source?: string
    link?: string
    contributor?: string
  }
  locales?: string[] // WIP
  displayFrom?: boolean
}

export class GoiSentence extends React.Component<GoiSentencePropsType> {
  static defaultProps = {
    i18nSentence: {
      from: "",
      sentence: "It's a sample sentence.",
      translation: {
        en: "It's the translation of the sample sentence.",
        zh: "这是例句的中文翻译",
        jp: "これは例句の日本語の翻訳です",
      },
      audios: [],
      source: "PoiGoi",
      link: "https://goi.poi.dev/",
      contributor: "凪",
    },
    displayHint: true,
    locales: ["jp", "zh", "en"],
    displayFrom: false,
  }
  render() {
    const { i18nSentence, displayFrom } = this.props
    return (
      <li>
        <div
          className="word-card-single-sentence"
          style={{ fontSize: "4vmin" }}
        >
          <span
            dangerouslySetInnerHTML={{ __html: i18nSentence.sentence }}
          ></span>
        </div>
        <div
          className="word-card-single-sentence-translation"
          style={{ fontSize: "4vmin" }}
        >
          {i18nSentence.translation &&
            Object.entries(i18nSentence.translation).map(
              ([translationLanguage, translationText]) => {
                return Object.keys(i18nSentence.translation || []).length > 1
                  ? `${translationLanguage}:${translationText}; `
                  : `${translationText}`
              }
            )}
        </div>
        {displayFrom && (
          <div
            style={{
              color: "gray",
              width: "100%",
              fontSize: "1.5vmin",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            from {i18nSentence.from}
          </div>
        )}
      </li>
    )
  }
}

export default GoiSentence
