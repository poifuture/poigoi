import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkDispatch } from "redux-thunk"
import { RootStateType } from "../states/RootState"
import { Action } from "redux"
import { Button, GridList, GridListTile } from "@material-ui/core"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import { navigate } from "gatsby"
import AddIcon from "@material-ui/icons/AddOutlined"
import SmsIcon from "@material-ui/icons/SmsOutlined"
import ShareIcon from "@material-ui/icons/ShareOutlined"
import MenuIcon from "@material-ui/icons/MenuOutlined"
import HighlightIcon from "@material-ui/icons/HighlightOutlined"
import PersonIcon from "@material-ui/icons/PersonOutlined"
import SyncIcon from "@material-ui/icons/SyncOutlined"
import FlagIcon from "@material-ui/icons/FlagOutlined"
import SearchIcon from "@material-ui/icons/SearchOutlined"
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlayOutlined"
import ShuffleIcon from "@material-ui/icons/ShuffleOutlined"
import FingerprintIcon from "@material-ui/icons/FingerprintOutlined"
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDownOutlined"
import CreateIcon from "@material-ui/icons/CreateOutlined"
import CloudOffIcon from "@material-ui/icons/CloudOffOutlined"
import FormatQuoteIcon from "@material-ui/icons/FormatQuoteOutlined"
import VolumeOffIcon from "@material-ui/icons/VolumeOffOutlined"
import VolumeUpIcon from "@material-ui/icons/VolumeUpOutlined"
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumberedOutlined"
import NavigateNextIcon from "@material-ui/icons/NavigateNextOutlined"
import MoreHorizIcon from "@material-ui/icons/MoreHorizOutlined"
import { ToggleEvents } from "../utils/PoiResponsive"
import { GoiWordRecordDataType } from "../models/GoiSaving"
import Heap from "../algorithm/Heap"
import { withTranslation, WithTranslation } from "react-i18next"

type CommandsBarPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation
interface CommandsBarStateType {
  menuOpened: boolean
  commandsExpanded: boolean
}

export class CommandsBar extends React.Component<
  CommandsBarPropsType,
  CommandsBarStateType
> {
  constructor(props: any) {
    super(props)
    this.state = {
      menuOpened: false,
      commandsExpanded: false,
    }
  }
  navigate(to: string) {
    navigate(to, { replace: true })
  }
  openMenu = () => {
    this.setState({ menuOpened: true })
  }
  closeMenu = () => {
    this.setState({ menuOpened: false })
  }
  toggleMenu = (display?: boolean) => {
    if (typeof display === "undefined") {
      display = !this.state.menuOpened
    }
    this.setState({ menuOpened: display })
  }
  render() {
    const { t } = this.props
    const { poiUserId, savingId } = this.props
    const smDown: boolean =
      typeof window !== "undefined" ? window.innerWidth < 600 : false
    return (
      <div
        className="commands-bar"
        style={{
          visibility: smDown && this.props.isTyping ? "hidden" : "inherit",
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "inline-flex",
          alignItems: "flex-end",
          maxWidth: "calc(100vw - 20px)",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "40px",
            margin: "8px",
            overflowX: "auto",
            direction: "rtl",
          }}
        >
          <div style={{ display: "inline-flex", direction: "ltr" }}>
            {this.state.commandsExpanded ? (
              <Button
                size="small"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  this.setState({ commandsExpanded: false })
                }}
              >
                {/* parse text or audio to add new words */}
                {t("UnexpandButtonText", "Less")}
                <NavigateNextIcon fontSize="small" />
              </Button>
            ) : (
              <Button
                size="small"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  this.setState({ commandsExpanded: true })
                }}
              >
                {/* parse text or audio to add new words */}
                {t("ExpandButtonText", "More")}
                <MoreHorizIcon fontSize="small" />
              </Button>
            )}
            {this.state.commandsExpanded && (
              <>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  {/* parse text or audio to add new words */}
                  [WIP]{t("ParseButtonText", "Parse")}
                  <FormatQuoteIcon fontSize="small" />
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  [WIP]{t("SearchButtonText", "Search")}
                  <SearchIcon fontSize="small" />
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  [WIP]{t("OrderButtonText", "Order")}
                  <PlaylistPlayIcon fontSize="small" />
                  {false && <ShuffleIcon fontSize="small" />}
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  {/* type select swipe */}
                  [WIP]{t("ModeButtonText", "Mode")}
                  <CreateIcon fontSize="small" />
                  {false && <FormatListNumberedIcon fontSize="small" />}
                  {false && <ThumbsUpDownIcon fontSize="small" />}
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  {/* swich savings in different mode */}
                  [WIP]{t("SavingsButtonText", "Savings")}
                  <FingerprintIcon fontSize="small" />
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  [WIP]{t("AudioButtonText", "Audio")}
                  <VolumeOffIcon fontSize="small" />
                  {false && <VolumeUpIcon fontSize="small" />}
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  [WIP]{t("SwotUpButtonText", "SwotUp")}
                  <FlagIcon fontSize="small" />
                </Button>
                <Button size="small" style={{ whiteSpace: "nowrap" }}>
                  [WIP]{t("SyncButtonText", "Sync")}
                  <CloudOffIcon fontSize="small" />
                  {false && <SyncIcon fontSize="small" />}
                </Button>
              </>
            )}
            {/* TODO: outline the button when all words are learned */}
            <Button
              size="small"
              {...(this.props.pendingCandidates.isEmpty() && {
                color: "secondary",
                variant: "outlined",
              })}
              style={{ whiteSpace: "nowrap" }}
              onClick={() => this.props.showWordAdder({ poiUserId, savingId })}
            >
              {t("AddWordsButtonText", "Words")}
              <AddIcon fontSize="small" />
            </Button>
          </div>
        </div>
        <SpeedDial
          ariaLabel="menu"
          open={this.state.menuOpened}
          icon={<MenuIcon fontSize="small" />}
          {...ToggleEvents(this.toggleMenu)}
          ButtonProps={{
            color: "default",
            size: "small",
            style: { background: "white", margin: "8px" },
          }}
        >
          <SpeedDialAction
            key="share"
            icon={<ShareIcon fontSize="small" />}
            tooltipTitle="[WIP] Share"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="tegami"
            icon={<SmsIcon fontSize="small" />}
            tooltipTitle="手紙"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/tegami/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="mamechishiki"
            icon={<HighlightIcon />}
            tooltipTitle="豆知識"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/mamechishiki/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="searchwords"
            icon={<SearchIcon />}
            tooltipTitle="[WIP] Search Words"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="addwords"
            icon={<AddIcon />}
            tooltipTitle="Add Words"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.props.showWordAdder({ poiUserId, savingId })
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="profile"
            icon={<PersonIcon />}
            tooltipTitle="[WIP] Profile, statics and settings"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/profile/")
            }}
          ></SpeedDialAction>
        </SpeedDial>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  console.debug("CommandsBar state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
    pendingCandidates: state.GoiTester.get("PendingCandidates") as Heap<
      GoiWordRecordDataType
    >,
    isTyping: state.GoiTester.get("IsTyping") as boolean,
  }
  console.debug("CommandsBar props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    showWordAdder: ({
      poiUserId,
      savingId,
    }: {
      poiUserId: PoiUser.PoiUserId
      savingId: GoiSavingId
    }) => dispatch(ShowWordAdderAction({ poiUserId, savingId })),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("CommandsBar")(CommandsBar))
