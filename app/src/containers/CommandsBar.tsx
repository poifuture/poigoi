import React from "react"
import { connect } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
import { withTranslation, WithTranslation } from "react-i18next"
import { Action } from "redux"
import {
  Button,
  GridList,
  GridListTile,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import { navigate } from "gatsby"
import { RootStateType } from "../states/RootState"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ToggleEvents } from "../utils/PoiResponsive"
import { GoiWordRecordDataType, GoiSavingDataType } from "../models/GoiSaving"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import { TreeMultiSet } from "tstl"
import AddIcon from "@material-ui/icons/AddOutlined"
import CloudOffIcon from "@material-ui/icons/CloudOffOutlined"
import CreateIcon from "@material-ui/icons/CreateOutlined"
import FingerprintIcon from "@material-ui/icons/FingerprintOutlined"
import FirstPageIcon from "@material-ui/icons/FirstPageOutlined"
import FlagIcon from "@material-ui/icons/FlagOutlined"
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumberedOutlined"
import FormatQuoteIcon from "@material-ui/icons/FormatQuoteOutlined"
import HighlightIcon from "@material-ui/icons/HighlightOutlined"
import MenuIcon from "@material-ui/icons/MenuOutlined"
import MoreHorizIcon from "@material-ui/icons/MoreHorizOutlined"
import NavigateNextIcon from "@material-ui/icons/NavigateNextOutlined"
import PersonIcon from "@material-ui/icons/PersonOutlined"
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlayOutlined"
import SearchIcon from "@material-ui/icons/SearchOutlined"
import ShareIcon from "@material-ui/icons/ShareOutlined"
import ShuffleIcon from "@material-ui/icons/ShuffleOutlined"
import SmsIcon from "@material-ui/icons/SmsOutlined"
import SyncIcon from "@material-ui/icons/SyncOutlined"
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDownOutlined"
import VolumeOffIcon from "@material-ui/icons/VolumeOffOutlined"
import VolumeUpIcon from "@material-ui/icons/VolumeUpOutlined"
import RefreshIcon from "@material-ui/icons/RefreshOutlined"
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1Outlined"
import DebugModule from "debug"
import { WordFilterType } from "../states/WordAdderState"
import {
  NewWordsOrderType,
  RevisitStrategyType,
} from "../states/GoiSettingsState"
import { UpdateGoiSettingsStateAction } from "../actions/GoiSettingsActions"
const debug = DebugModule("PoiGoi:CommandsBar")

type CommandsBarPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation
interface CommandsBarStateType {
  isMenuOpened: boolean
  isCommandsExpanded: boolean
  isSyncOpened: boolean
}

export class CommandsBar extends React.Component<
  CommandsBarPropsType,
  CommandsBarStateType
> {
  commandsContainerRef = React.createRef<HTMLDivElement>()
  constructor(props: any) {
    super(props)
    this.state = {
      isMenuOpened: false,
      isCommandsExpanded: false,
      isSyncOpened: false,
    }
  }
  navigate(to: string) {
    navigate(to, { replace: true })
  }
  openMenu = () => {
    this.setState({ isMenuOpened: true })
  }
  closeMenu = () => {
    this.setState({ isMenuOpened: false })
  }
  toggleMenu = (display?: boolean) => {
    if (typeof display === "undefined") {
      display = !this.state.isMenuOpened
    }
    this.setState({ isMenuOpened: display })
  }
  render() {
    const { t } = this.props
    const smDown: boolean =
      typeof window !== "undefined" ? window.innerWidth < 600 : false
    const savingLanguage =
      this.props.saving && this.props.saving.Language
        ? this.props.saving.Language
        : "en"
    const syncUrl = `${window.location.origin}?action=newsync&token=${this.props.poiUserId}:${this.props.pouchDbPassword}`
    const isSyncing = !!this.props.pouchDbPassword
    return (
      <div
        className="commands-bar"
        style={{
          pointerEvents: "none", // prevent blocking wordcard ui
          visibility: smDown && this.props.isTyping ? "hidden" : "inherit",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "inline-flex",
          alignItems: "flex-end",
          maxWidth: "calc(100vw - 20px)",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            height: "40px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              margin: "auto",
            }}
          >
            {smDown && this.state.isCommandsExpanded && (
              <IconButton
                size="small"
                aria-label="Scroll command bar to left end"
                onClick={() => {
                  this.commandsContainerRef.current &&
                    this.commandsContainerRef.current.scrollTo({
                      left: -10000,
                      behavior: "smooth",
                    })
                }}
              >
                <FirstPageIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </div>
        <div
          ref={this.commandsContainerRef}
          style={{
            pointerEvents: "auto",
            display: "flex",
            height: "40px",
            marginTop: "8px",
            marginBottom: "8px",
            overflowX: "auto",
            overflowY: "hidden",
            direction: "rtl",
          }}
        >
          <div style={{ display: "inline-flex", direction: "ltr" }}>
            {this.state.isCommandsExpanded ? (
              <Button
                size="small"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  this.setState({ isCommandsExpanded: false })
                }}
              >
                {/* parse text or audio to add new words */}
                {t("FoldButtonText", "Less")}
                <NavigateNextIcon fontSize="small" />
              </Button>
            ) : (
              <Button
                size="small"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  this.setState({ isCommandsExpanded: true })
                }}
              >
                {/* parse text or audio to add new words */}
                {t("ExpandButtonText", "More")}
                <MoreHorizIcon fontSize="small" />
              </Button>
            )}
            {this.state.isCommandsExpanded && (
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
                {this.props.revisitStrategy === "RevisitFirst" ||
                this.props.revisitStrategy === "User" ? (
                  <Button
                    size="small"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      this.props.updateGoiSettingsState({
                        revisitStrategy: "NoRevisit",
                      })
                    }}
                  >
                    {t("RevisitFirstButtonText", "Revisit")}
                    <RefreshIcon fontSize="small" />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      this.props.updateGoiSettingsState({
                        revisitStrategy: "RevisitFirst",
                      })
                    }}
                  >
                    {t("NoRevisitButtonText", "NoRevisit")}
                    <ExposureNeg1Icon fontSize="small" />
                  </Button>
                )}
                {this.props.newWordsOrder === "Ordered" ||
                this.props.newWordsOrder === "User" ? (
                  <Button
                    size="small"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      this.props.updateGoiSettingsState({
                        newWordsOrder: "Shuffle",
                      })
                    }}
                  >
                    {t("OrderedButtonText", "Ordered")}
                    <PlaylistPlayIcon fontSize="small" />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      this.props.updateGoiSettingsState({
                        newWordsOrder: "Ordered",
                      })
                    }}
                  >
                    {t("ShuffleButtonText", "Shuffle")}
                    <ShuffleIcon fontSize="small" />
                  </Button>
                )}
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
                <Button
                  size="small"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    this.setState({ isSyncOpened: true })
                  }}
                >
                  {t("SyncButtonText", "Sync")}
                  {!!this.props.pouchDbPassword ? (
                    <SyncIcon fontSize="small" />
                  ) : (
                    <CloudOffIcon fontSize="small" />
                  )}
                </Button>
              </>
            )}
            {/* TODO: outline the button when all words are learned */}
            <Button
              size="small"
              {...(this.props.pendingCandidates.size() === 0 && {
                color: "secondary",
                variant: "outlined",
              })}
              style={{ whiteSpace: "nowrap" }}
              onClick={() => this.props.showWordAdder()}
            >
              {t("AddWordsButtonText", "Words")}
              <AddIcon fontSize="small" />
            </Button>
          </div>
        </div>
        <SpeedDial
          ariaLabel="menu"
          // open={this.state.isMenuOpened}
          open={true}
          icon={<MenuIcon fontSize="small" />}
          {...ToggleEvents(this.toggleMenu)}
          FabProps={{
            color: "default",
            size: "small",
            style: { background: "white", margin: "8px" },
          }}
        >
          <SpeedDialAction
            key="share"
            icon={<ShareIcon fontSize="small" />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {"[WIP] " + t("ShareMenuButtonText", "Share")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="tegami"
            icon={<SmsIcon fontSize="small" />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {savingLanguage.startsWith("ja")
                  ? "作者の手紙"
                  : t("TegamiMenuButtonText", "作者の手紙")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/tegami/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="mamechishiki"
            icon={<HighlightIcon />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {savingLanguage.startsWith("ja")
                  ? "豆知識"
                  : t("MamechishikiMenuButtonText", "豆知識")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/mamechishiki/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="searchwords"
            icon={<SearchIcon />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {"[WIP] " + t("SearchMenuButtonText", "Search Words")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="addwords"
            icon={<AddIcon />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {t("AddWordsMenuButtonText", "Add Words")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.props.showWordAdder()
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="profile"
            icon={<PersonIcon />}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}>
                {"[WIP] " +
                  t("ProfileMenuButtonText", "Profile, statics and settings")}
              </span>
            }
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.navigate("/profile/")
            }}
          ></SpeedDialAction>
        </SpeedDial>
        <Dialog open={this.state.isSyncOpened}>
          <DialogTitle>Sync</DialogTitle>
          <DialogContent>
            <a href={syncUrl} style={{ wordBreak: "break-all" }}>
              {syncUrl}
            </a>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isSyncOpened: false })}>
              {t("WordAdderCancelButtonText", "Close")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  debug("CommandsBar state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    pouchDbPassword: state.GoiUser.get("PouchDbPassword") as string,
    saving: state.GoiSaving.get("Saving") as
      | GoiSavingDataType
      | null
      | undefined,
    pendingCandidates: state.GoiTester.get("PendingCandidates") as TreeMultiSet<
      GoiWordRecordDataType
    >,
    isTyping: state.GoiTester.get("IsTyping") as boolean,
    newWordsOrder: state.GoiSettings.get("NewWordsOrder") as NewWordsOrderType,
    revisitStrategy: state.GoiSettings.get(
      "RevisitStrategy"
    ) as RevisitStrategyType,
  }
  debug("CommandsBar props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {
    showWordAdder: () => dispatch(ShowWordAdderAction()),
    updateGoiSettingsState: ({
      newWordsOrder,
      revisitStrategy,
    }: {
      newWordsOrder?: NewWordsOrderType
      revisitStrategy?: RevisitStrategyType
    }) =>
      dispatch(
        UpdateGoiSettingsStateAction({ newWordsOrder, revisitStrategy })
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("CommandsBar")(CommandsBar))
