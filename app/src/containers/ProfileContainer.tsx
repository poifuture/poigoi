import React from "react"
import { connect } from "react-redux"
import { ShowWordAdderAction } from "../actions/WordAdderActions"
import * as PoiUser from "../utils/PoiUser"
import { GoiSavingId } from "../types/GoiTypes"
import { ThunkDispatch } from "redux-thunk"
import { RootStateType } from "../states/RootState"
import { Action } from "redux"
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
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:ProfileContainer")

type ProfileContainerPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface ProfileContainerStateType {
  destroyDialogOpened: boolean
  destroyUserConfirm: string
  allDataUrl: string
}

export class ProfileContainer extends React.Component<
  ProfileContainerPropsType,
  ProfileContainerStateType
> {
  constructor(props: ProfileContainerPropsType) {
    super(props)
    this.state = {
      destroyDialogOpened: false,
      destroyUserConfirm: "",
      allDataUrl: "",
    }
  }
  componentDidMount = async () => {
    const allDocs = await GoiDb().allDocs({
      include_docs: true,
      attachments: true,
    })
    const blob = new Blob([JSON.stringify(allDocs)], {
      type: "text/plain;charset=utf-8",
    })
    this.setState({ allDataUrl: URL.createObjectURL(blob) })
  }
  navigate(to: string) {
    navigate(to, { replace: true })
  }
  repairData = async () => {}
  confirmDestroyData = async () => {
    this.setState({ destroyDialogOpened: false, destroyUserConfirm: "" })
    await GoiDb().destroy()
    window.location.reload()
  }
  exportAllData = async () => {
    const allDocs = await GoiDb().allDocs({
      include_docs: true,
      attachments: true,
    })
    const blob = new Blob([JSON.stringify(allDocs)], {
      type: "application/json",
    })
    saveAs(blob, "GoiSaving.json")
  }
  onClickBugReport = async () => {
    window.location.href =
      "https://forms.office.com/Pages/ResponsePage.aspx?id=HO2aql64JEqeASBBMrBBF5y2nH0iJiFBmV42lNreWUVUN0dWTElDTTNPSUFTQzVSRUtJUldQM0ZDSiQlQCN0PWcu"
  }
  onClickUnregisterServiceWorker = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (let registration of registrations) {
      registration.unregister()
    }
    window.location.reload()
  }
  render() {
    const { poiUserId, savingId } = this.props
    return (
      <div className="profile-container">
        <MuiList>
          <h1>Troubleshooting Zone</h1>
          <ListItem>
            Try to upgrade the local database from outdated data structure.
          </ListItem>
          <ListItem>
            <Button variant="contained" onClick={this.repairData}>
              Repair data
              <DescriptionIcon />
            </Button>
          </ListItem>
          <ListItem>
            Export all local data in a single json file. It won't take your
            network usage.
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={async () => await this.exportAllData()}
            >
              Export all data (Download)
              <DescriptionIcon />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={async () => await this.navigate("/dumpdata/")}
            >
              Export all data (Navigate)
              <DescriptionIcon />
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="contained" onClick={this.onClickBugReport}>
              Bug Report
              <BugReportIcon />
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="contained">
              [WIP] Help desk
              <LiveHelpIcon />
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="contained">
              [WIP] Help desk wechat
              <LiveHelpIcon />
            </Button>
          </ListItem>
          <ListItem>
            If there is a fatal error that cannot be resolved, you can destroy
            entire local database with the following button. Please contact us
            first before doing so.
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={() =>
                this.setState({
                  destroyDialogOpened: true,
                  destroyUserConfirm: "",
                })
              }
            >
              Unregister Service Worker
              <DeleteForeverIcon />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                this.setState({
                  destroyDialogOpened: true,
                  destroyUserConfirm: "",
                })
              }
            >
              Destroy all local data
              <DeleteForeverIcon />
            </Button>
          </ListItem>
          <Dialog open={this.state.destroyDialogOpened} maxWidth="xl">
            <DialogTitle>Destroy all data</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                placeholder="Type DESTROY to continue"
                value={this.state.destroyUserConfirm}
                onChange={e =>
                  this.setState({ destroyUserConfirm: e.target.value })
                }
              ></TextField>
            </DialogContent>
            <DialogActions>
              <Button
                size="small"
                onClick={() => this.setState({ destroyDialogOpened: false })}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                disabled={
                  this.state.destroyUserConfirm.toLowerCase() !== "destroy"
                }
                onClick={this.confirmDestroyData}
              >
                Destroy all data
                <DeleteForeverIcon fontSize="small" />
              </Button>
            </DialogActions>
          </Dialog>
        </MuiList>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  debug("ProfileContainer state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
  }
  debug("ProfileContainer props: ", props)
  return props
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootStateType, void, Action>
) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileContainer)
