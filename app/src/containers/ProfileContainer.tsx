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
} from "@material-ui/core"
import { saveAs } from "file-saver"
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
import DeleteIcon from "@material-ui/icons/DeleteOutlined"
import DeleteForeverIcon from "@material-ui/icons/DeleteForeverOutlined"
import DescriptionIcon from "@material-ui/icons/DescriptionOutlined"
import { GoiDb } from "../utils/GoiDb"

type ProfileContainerPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
interface ProfileContainerStateType {
  destroyDialogOpened: boolean
  destroyUserConfirm: string
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
    }
  }
  navigate(to: string) {
    navigate(to, { replace: true })
  }
  repairData = async () => {
    this.setState({ destroyDialogOpened: false, destroyUserConfirm: "" })
    await GoiDb().destroy()
    window.location.reload()
  }
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
      type: "test/json;charset=utf-8",
    })
    saveAs(blob, "GoiSaving.json")
  }
  render() {
    const { poiUserId, savingId } = this.props
    return (
      <div className="profile-container">
        <h1>Trouble shooting</h1>
        <Button variant="contained" onClick={this.repairData}>
          Repair data
          <DescriptionIcon />
        </Button>
        <div>
          Export all local data in a single json file. It won't take your
          network usage.
        </div>
        <Button variant="contained" onClick={this.exportAllData}>
          Export all local data
          <DescriptionIcon />
        </Button>
        <div>
          If there is a fatal error that cannot be resolved, you can destroy
          entire local database with the following button. Please contact us
          first before doing so.
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            this.setState({ destroyDialogOpened: true, destroyUserConfirm: "" })
          }
        >
          Destroy all local data
          <DeleteForeverIcon />
        </Button>
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
              onClick={() => this.setState({ destroyDialogOpened: false })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={
                this.state.destroyUserConfirm.toLowerCase() !== "destroy"
              }
              onClick={this.confirmDestroyData}
            >
              Destroy all data
              <DeleteForeverIcon />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state: RootStateType) => {
  console.debug("ProfileContainer state: ", state)
  const props = {
    poiUserId: state.GoiUser.get("PoiUserId") as PoiUser.PoiUserId,
    savingId: state.GoiSaving.get("SavingId") as GoiSavingId,
  }
  console.debug("ProfileContainer props: ", props)
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
)(ProfileContainer)
