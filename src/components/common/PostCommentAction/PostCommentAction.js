import { useState, memo } from 'react'

import { deletePostComment } from '../../../firebase/firestore'
// Mui components
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { CircularProgress } from '@mui/material'

// Mui icons
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const PostCommentAction = memo(({
  // TODO: edit space post area will affect the rerender
  type,
  id,
  uid,
  authUserId,
  spaceId,
  parentId,
  postId,
  setEditMode,
}) => {
  console.log(1)
  // State 
  const [anchorEl, setAnchorEl] = useState(null)
   
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const open = Boolean(anchorEl)
  // Event function
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleCloseDialog = () => setOpenDialog(false)
  const handleEdit = () => {
    setEditMode(true)
    setAnchorEl(null)
  }
  const handleDelete = () => {
    setOpenDialog(true)
    setAnchorEl(null)
  }

  const handleDeletePostComment= async () => {
    setLoading(true)
    try {
      await deletePostComment(type, id, uid, spaceId, parentId, postId)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      setLoading(false)
      setOpenDialog(false)
    }
  }

  return (
    <>
      <Box
        sx={{ml: 'auto'}}
      >
        <IconButton
          aria-label="menu"
          component="label"
          aria-controls={open ? 'menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {uid === authUserId &&
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <ModeEditOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          }
          {uid === authUserId &&
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          }
        </Menu>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        Delete {type}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete your {type} permanently?
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeletePostComment} autoFocus>
            Delete
          </Button>
        </DialogActions>}
      </Dialog>
    </>
  )
})

export default PostCommentAction