import React from "react"
import { I18nString } from "../../types/GoiDictionaryTypes"
import { List as MuiList, Box } from "@material-ui/core"
import TinyTag from "./TinyTag"
import { ToggleEvents } from "../../utils/PoiResponsive"
import { WithTranslation, withTranslation } from "react-i18next"

export type GoiTranslationPropsType = WithTranslation & {
  i18nTranslation: {
    translation: I18nString
    hint?: I18nString
  }
  displayHint?: boolean
  locales?: string[] // WIP
  from?: string
  displayFrom?: boolean
}
interface GoiTranslationStateType {
  displayHint: boolean
}

export class GoiTranslation extends React.Component<
  GoiTranslationPropsType,
  GoiTranslationStateType
> {
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
  constructor(props: GoiTranslationPropsType) {
    super(props)
    this.state = {
      displayHint: false,
    }
  }
  toggleStateHint = (display?: boolean) => {
    if (typeof display === "undefined") {
      display = !this.state.displayHint
    }
    this.setState({ displayHint: display })
  }
  render() {
    const { t } = this.props
    const { i18nTranslation, from, displayFrom } = this.props
    const displayHint = this.props.displayHint || this.state.displayHint
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
            <TinyTag {...ToggleEvents(this.toggleStateHint)}>
              {t("Hint")}
            </TinyTag>
            {Object.entries(i18nTranslation.hint).map(
              ([hintLanguage, hintText]) => (
                <span
                  key={hintLanguage}
                  style={{
                    visibility: displayHint ? "inherit" : "hidden",
                    fontSize: "3vmin",
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
                </span>
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

export default withTranslation("Common")(GoiTranslation)
