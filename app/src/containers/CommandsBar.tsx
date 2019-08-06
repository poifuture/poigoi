import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkDispatch } from "redux-thunk"
import { RootStateType } from "../states/RootState"
import { Action } from "redux"
import * as Icons from "@material-ui/icons"
import * as MUI from "@material-ui/core"
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab"
import { navigate } from "gatsby"

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
        <MUI.Button
          size="small"
          onClick={() => this.props.showWordAdder({ poiUserId, savingId })}
          style={{ height: "36px", margin: "10px" }}
        >
          Add Words
          <Icons.Add fontSize="small" />
        </MUI.Button>

        <SpeedDial
          ariaLabel="menu"
          open={this.state.menuOpened}
          icon={<Icons.MenuOutlined />}
          onBlur={this.closeMenu}
          onClick={this.toggleMenu}
          onClose={this.closeMenu}
          onFocus={this.openMenu}
          onMouseEnter={this.openMenu}
          onMouseLeave={this.closeMenu}
          ButtonProps={{
            color: "default",
            style: { background: "white" },
          }}
        >
          <SpeedDialAction
            key="share"
            icon={<Icons.ShareOutlined />}
            tooltipTitle="[WIP] Share"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="tegami"
            icon={<Icons.SmsOutlined />}
            tooltipTitle="手紙"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              navigate("/tegami")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="mamechishiki"
            icon={<Icons.HighlightOutlined />}
            tooltipTitle="豆知識"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              navigate("/mamechishiki")
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="addwords"
            icon={<Icons.AddOutlined />}
            tooltipTitle="Add Words"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              this.props.showWordAdder({ poiUserId, savingId })
            }}
          ></SpeedDialAction>
          <SpeedDialAction
            key="profile"
            icon={<Icons.PersonOutlined />}
            tooltipTitle="[WIP] Profile and settings"
            tooltipOpen
            onClick={() => {
              this.closeMenu()
              navigate("/")
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
