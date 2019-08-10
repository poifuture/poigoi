import React, { ReactPropTypes } from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkDispatch } from "redux-thunk"
import { RootStateType } from "../states/RootState"
import { Action, compose } from "redux"
import NavBar from "../components/NavBar"
import CommandsBar from "./CommandsBar"
import Container from "@material-ui/core/Container"
import { Hidden } from "@material-ui/core"
import { poisky } from "../utils/PoiColors"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List as MuiList,
  ListItem,
} from "@material-ui/core"
import { saveAs } from "file-saver"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import { navigate, Link } from "gatsby"
import AddIcon from "@material-ui/icons/AddOutlined"
import SmsIcon from "@material-ui/icons/SmsOutlined"
import ShareIcon from "@material-ui/icons/ShareOutlined"
import MenuIcon from "@material-ui/icons/MenuOutlined"
import HighlightIcon from "@material-ui/icons/HighlightOutlined"
import PersonIcon from "@material-ui/icons/PersonOutlined"
import SyncIcon from "@material-ui/icons/SyncOutlined"
import FlagIcon from "@material-ui/icons/FlagOutlined"
import SearchIcon from "@material-ui/icons/SearchOutlined"
import DeleteIcon from "@material-ui/icons/DeleteOutlined"
import DeleteForeverIcon from "@material-ui/icons/DeleteForeverOutlined"
import DescriptionIcon from "@material-ui/icons/DescriptionOutlined"
import BugReportIcon from "@material-ui/icons/BugReportOutlined"
import LiveHelpIcon from "@material-ui/icons/LiveHelpOutlined"
import { GoiDb } from "../utils/GoiDb"
import { LanguageCode } from "../types/PoiI18nTypes"
import { withTranslation, WithTranslation } from "react-i18next"
import Helmet from "react-helmet"

type LandingPagePropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation & {
    locale: LanguageCode
    hero: string
  }
interface LandingPageStateType {}

export class LandingPage extends React.Component<
  LandingPagePropsType,
  LandingPageStateType
> {
  constructor(props: LandingPagePropsType) {
    super(props)
    this.state = {}
  }
  navigate(to: string) {
    navigate(to, { replace: true })
  }
  render() {
    const { t } = this.props
    return (
      <div className="goi-landing">
        <Helmet title={t("Title", "PoiGoi - recite words")} defer={false}>
          <title>{t("Title", "PoiGoi - recite words")}</title>
          <meta name="author" content="nagi" />
          <meta
            name="description"
            content={t("Description", "PoiGoi, an app to recite words.")}
          />
          <meta
            name="keywords"
            content={t(
              "Keywords",
              "vocabulary, words, recite, education, goi, poigoi, poifuture"
            )}
          />
        </Helmet>
        <div style={{ background: poisky, height: "1px" }} />
        <main>
          <h1>{t("Title", "Hero landing page")}</h1>
          {this.props.hero}
          <a href={`/?locale=${this.props.locale}`}>Let's goi!</a>
        </main>
        <footer style={{ position: "absolute", bottom: 0 }}>
          <Container>
            <ruby>
              私<rt>わたし</rt>
            </ruby>
            たちの
            <ruby>
              夢<rt>ゆめ</rt>
            </ruby>
            をここから
            <ruby>
              始<rt>はじ</rt>
            </ruby>
            めましょう ٩(ˊᗜˋ*)و
          </Container>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  console.debug("LandingPage state: ", state)
  const props = {
    // poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    // savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
  }
  console.debug("LandingPage props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    // showWordAdder: ({
    //   poiUserId,
    //   savingId,
    // }: {
    //   poiUserId: PoiUser.PoiUserId
    //   savingId: GoiSavingId
    // }) => dispatch(ShowWordAdderAction({ poiUserId, savingId })),
  }
}

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withTranslation("LandingPage")(LandingPage))

export default withTranslation("LandingPage")(LandingPage)
