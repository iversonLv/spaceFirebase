import { useEffect, useState, memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// MUI component
import Button from '@mui/material/Button'
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// constants
import { HOME_URL, SIGN_IN_UP_URL, SPACES_URL } from '../../../constants'

// context
import useAuth from '../../../firebase/auth'
import { userJoinSpace, userLeaveSpace, getUserSpaceJoinLeaveState, deleteSpace } from "../../../firebase/firestore";
import useSpaces from '../../../firebase/space'


const JoinLeaveBtn = memo(({space, isEditPage=false, loadingDisabled}) => {
  console.log(space)
  // Context
  const { authUser } = useAuth()
  const { fetchSpaces } = useSpaces()
  // Hook
  const navigate = useNavigate()
  const location = useLocation()

  // State
  const [loading, setLoading] = useState(false)
  // snack bar state 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [joined, setJoined] = useState(false)

  // dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [actionType, setActionType] = useState('')

  // Effect
  useEffect(() => {
    getUserSpaceJoinLeaveState(space.id, authUser, setJoined)
  }, [space.id, authUser]);

  // Event function
  const handleCloseDialog = (e) => {
    e.stopPropagation();
    setOpenDialog(false)
  }
  const handleAction = async(e, actionType) => {
    e.stopPropagation();
    setOpen(false);
    setLoading(true)
    if (actionType === 'Leave') {
      await userLeaveSpace(authUser, space.id)
    } else {
      await deleteSpace(authUser.uid, space)
      // if at space detail page, should navigate to other page
      if (location.pathname.indexOf('spaces') >= 0) {
        navigate(HOME_URL)
      } else {
        // if at profile page or home page
        await fetchSpaces()
      }
    }
    setLoading(false)
    setOpenDialog(false)
    setOpen(true);
    setMessage(`${actionType} the space succeed!`);
  }

  const handleJoin = async(e) => {
    // Stop progagation during click the btn on Card
    e.stopPropagation();
    setOpen(false);
    setLoading(true)
    await userJoinSpace(authUser, space.id)
    setLoading(false)
    setOpen(true);
    setMessage('Congrates, you have joined the space.')
  }

  const handleOpenDialog = (e, actionType) => {
    e.stopPropagation();
    setActionType(actionType)
    setOpenDialog(true)
  }
  
  const handleClickBtn = (e, url) => {
    e.stopPropagation()
    navigate(url)
  }

  const handleClose = (e, reason) => {
    // Stop progagation during click the btn on Card
    e?.stopPropagation()
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Content
  const BTNS = () => {
    if (!authUser) {
      // if non-login show sign up to join, otherwith show join or leave btn
      return <Button variant="outlined" size='small'  color="secondary" onClick={(e) => handleClickBtn(e, SIGN_IN_UP_URL)}>Sign in/up to Join</Button>
    }
    // if space author is authUser, then it should not be able to join or leave the space
    if (space?.author?.uid === authUser.uid) {
      return (
        <>
          {!isEditPage && <Button variant="outlined" size='small' color="secondary" onClick={(e) => handleClickBtn(e, `${SPACES_URL}/${space.id}/edit`)}>Edit</Button>}
          <Button variant="outlined" color="warning"  size='small' disabled={loadingDisabled} onClick={(e) => handleOpenDialog(e, 'Delete')}>Delete</Button>
        </>
      )
    }
    return (
      // If join will show leave btn otherwise show join btn
      <>
      {joined
      ? <Button variant="outlined" color="warning" size='small'  disabled={loading} onClick={(e) => handleOpenDialog(e, 'Leave')}>Leave</Button>
      : <Button variant="outlined" size='small' disabled={loading} onClick={(e) => handleJoin(e)}>Join</Button>
      }
        {open && <SnackbarAlert open={open} handleClose={handleClose} message={message}/>}
      </>
    ) 
  }
  return (
    <>
      <BTNS />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontWeight: 'light'
          }}
        >
        Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: 'text-primary'
            }}  
          >
            {actionType} the space: 
            <Typography
              variant='body2'
              component='span'
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}
            >
              {space?.title}
            </Typography> ?
            <br/>
            {actionType === 'Leave' && <Typography
              variant='caption'
            >
              You could join the space again.
            </Typography>
            }
            {actionType === 'Delete' && <Typography
              variant='caption'
            >
              It won't be restored. 
            </Typography>
            }
          </DialogContentText>
        </DialogContent>
        {loading &&
          <DialogActions
            sx={{justifyContent: 'center'}}
          >
            <CircularProgress color="inherit" />
          </DialogActions>
        }
        {!loading && <DialogActions>
          <Button size='small' onClick={(e) => handleCloseDialog(e)}>Cancel</Button>
          <Button size='small' onClick={(e) => handleAction(e, actionType)}>
            Yes
          </Button>
        </DialogActions>}
      </Dialog>
    </>
  )
})

export default JoinLeaveBtn