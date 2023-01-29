import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// MUI component
import Button from '@mui/material/Button'
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert'

// constants
import { REGISTER_URL, SPACES_URL } from '../../../constants'

// context
import useAuth from '../../../firebase/auth'
import { userJoinSpace, userLeaveSpace, getUserSpaceJoinLeaveState } from "../../../firebase/firestore";


const JoinLeaveBtn = ({space}) => {
  const [loading, setLoading] = useState(false)
  const { authUser } = useAuth()
  const navigate = useNavigate()
  
  // snack bar state 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    getUserSpaceJoinLeaveState(space.id, authUser, setJoined)
  }, [space, authUser]);

  const handleJoin = async(e) => {
    // Stop progagation during click the btn on Card
    e.stopPropagation();
    setOpen(false);
    setLoading(true)
    await userJoinSpace(authUser, space)
    setLoading(false)
    setOpen(true);
    setMessage('Congrates, you have joined the space.')
  }

  const handleLeave = async(e) => {
    // Stop progagation during click the btn on Card
    e.stopPropagation();
    setOpen(false);
    setLoading(true)
    await userLeaveSpace(authUser, space)
    setLoading(false)
    setOpen(true);
    setMessage('Leave the space succeed!');
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


  if (!authUser) {
    // if non-login show sign up to join, otherwith show join or leave btn
    return <Button variant="outlined" onClick={(e) => handleClickBtn(e, REGISTER_URL)}>Sign up to Join</Button>
  }
  // if space author is authUser, then it should not be able to join or leave the space
  if (space?.author?.uid === authUser.uid) {
    return <Button variant="outlined" color="secondary" onClick={(e) => handleClickBtn(e, `${SPACES_URL}/${space.id}/edit`)}>Edit</Button>
  }
  return (
    // If join will show leave btn otherwise show join btn
    <>
    {joined
    ? <Button variant="outlined" color="error" disabled={loading} onClick={(e) => handleLeave(e)}>Leave</Button>
    : <Button variant="outlined" disabled={loading} onClick={(e) => handleJoin(e)}>Join</Button>
    }
      <SnackbarAlert open={open} handleClose={handleClose} message={message}/>
    </>
  ) 
}

export default JoinLeaveBtn