import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkDispatch } from "redux-thunk"
import { RootStateType } from "../states/RootState"
import { Action } from "redux"
import { Button } from "@material-ui/core"
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

type CommandsBarPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface CommandsBarStateType {
  menuOpened: boolean
}

export class CommandsBar extends React.Component<
  CommandsBarPropsType,
  CommandsBarStateType
> {
  constructor(props: any) {
    super(props)
    this.state = {
      menuOpened: false,
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
  toggleMenu = () => {
    this.setState({ menuOpened: !this.state.menuOpened })
  }
  render() {
    const { poiUserId, savingId } = this.props
    return (
      <div
        className="commands-bar"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "inline-flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            height: "40px",
            margin: "8px",
          }}
        >
          <Button size="small">
            [WIP] SwotUp
            <FlagIcon fontSize="small" />
          </Button>
          <Button size="small">
            [WIP] Sync
            <SyncIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => this.props.showWordAdder({ poiUserId, savingId })}
          >
            Words
            <AddIcon fontSize="small" />
          </Button>
        </div>
        <SpeedDial
          ariaLabel="menu"
          open={this.state.menuOpened}
          icon={<MenuIcon fontSize="small" />}
          onBlur={this.closeMenu}
          onClick={this.toggleMenu}
          onClose={this.closeMenu}
          onFocus={this.openMenu}
          onMouseEnter={this.openMenu}
          onMouseLeave={this.closeMenu}
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
              this.navigate("/")
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
)(CommandsBar)
