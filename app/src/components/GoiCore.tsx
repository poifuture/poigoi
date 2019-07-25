import React from "react"
import WordCard from "./WordCard"
import KanaDictionary from "../dictionary/KanaDictionary"
import { GoiJaWordType } from "../dictionary/GoiDictionary"

export interface GoiCorePropsType {}

export interface GoiCoreStateType {
  currentWord: GoiJaWordType
}

export class GoiCore extends React.Component<
  GoiCorePropsType,
  GoiCoreStateType
> {
  defaultProps = {}
  constructor(props: any) {
    super(props)
    this.state = {
      currentWord: KanaDictionary.words["あ"],
    }
  }
  render() {
    return (
      <div className="goi-core">
        <input id="test-input"></input>
        <WordCard
          word={this.state.currentWord}
          display="detailed"
          status="success"
        />
      </div>
    )
  }
}

export default GoiCore
