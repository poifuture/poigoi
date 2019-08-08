import React from "react"
import NavBar from "../components/NavBar"
import GoiTester from "../containers/GoiTester"
import WordAdder from "../containers/WordAdder"
import CommandsBar from "../containers/CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import ProfileContainer from "../containers/ProfileContainer"
import { GoiDb } from "../utils/GoiDb"

interface DumpDataPagePropsType {}
interface DumpDataPageStateType {
  dataString: string
}
export default class DumpDataPage extends React.Component<
  DumpDataPagePropsType,
  DumpDataPageStateType
> {
  constructor(props: DumpDataPagePropsType) {
    super(props)
    this.state = { dataString: "" }
  }
  componentDidMount = async () => {
    const allDocs = await GoiDb().allDocs({
      include_docs: true,
      attachments: true,
    })
    const dataString = JSON.stringify(allDocs, null, 2)
    this.setState({ dataString })
  }
  render() {
    return (
      <div className="goi-dump-data">
        <pre lang="json">{this.state.dataString}</pre>
      </div>
    )
  }
}
