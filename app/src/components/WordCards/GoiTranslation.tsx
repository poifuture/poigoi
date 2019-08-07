import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import TinyTag from "./TinyTag"

export type GoiTranslationPropsType = {
  i18nTranslation: {
    translation: I18nString
    hint?: I18nString
  }
  displayHint?: boolean
  locales?: string[] // WIP
  from?: string
  displayFrom?: boolean
}

export class GoiTranslation extends React.Component<GoiTranslationPropsType> {
  static defaultProps = {
    i18nTranslation: {
      translation: {
        en: "English Translation",
        zh: "中文翻译",
        jp: "日本語",
      },
      hint: {
        en: "English Hint",
        zh: "中文提示",
        jp: "日本語",
      },
    },
    displayHint: true,
    locales: ["jp", "zh", "en"],
    from: "",
    displayFrom: false,
  }
  render() {
    const { i18nTranslation, displayHint, from, displayFrom } = this.props
    return (
      <li>
        <div
          className="word-card-single-translation"
          style={{ fontSize: "8vmin" }}
        >
          {Object.entries(i18nTranslation.translation).map(
            ([translationLanguage, translationText]) => {
              return Object.keys(i18nTranslation.translation).length > 1
                ? `${translationLanguage}:${translationText}; `
                : `${translationText}`
            }
          )}
        </div>
        {i18nTranslation.hint && (
          <div className="word-card-single-translation-hint">
            <TinyTag>Hint</TinyTag>
            {Object.entries(i18nTranslation.hint).map(
              ([hintLanguage, hintText]) => (
                <div
                  style={{
                    visibility: displayHint ? "inherit" : "hidden",
                  }}
                >
                  {Object.keys(i18nTranslation.hint || {}).length > 1 && (
                    <TinyTag>{hintLanguage}</TinyTag>
                  )}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: hintText || "",
                    }}
                  />
                </div>
              )
            )}
          </div>
        )}
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
            from {from}
          </div>
        )}
      </li>
    )
  }
}

export default GoiTranslation
