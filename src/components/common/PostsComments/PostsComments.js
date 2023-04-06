import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

// Constants
import { TYPE_COMMENT } from "../../../constants";
// Firebase
import { getComments, addComment } from "../../../firebase/firestore";
import useAuth from "../../../firebase/auth";
// Mui components
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography
 } from "@mui/material";

//  Mui icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Components
import LikeDislike from "../LikeDislike/LikeDislike";
import PostsCommentsSkeleton from "./PostsCommentsSkeleton";
import PostsCommentList from "../PostsCommentList/PostsCommentList";
import CommonAvatar from "../CommonAvatar/CommonAvatar";

const PostsComments = ({id, spaceAuthorUid, type, postCommentAuthor}) => {
  // Context
  const { authUser } = useAuth()
  // Hook
  const param = useParams()
  // State
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [disabledCreate, setDisabledCreate] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [getCommentsLoading, setGetCommentsLoading] = useState(false)
  const [comment, setComment] = useState('')

  // Effect
  useEffect(() => {
    const fetchComments = async() => {
      await getComments(type, id, setComments)
    }

    fetchComments()
  }, [id, type]);
  
  // Event function
  const handleReplay = (id) => setSelectedId(id)
  // get posts
  // useEffect(() => {
  //   // const fetchComments = async() => {
  //   //   await getComments(id, setComments)
  //   // }
  //   // fetchComments()
  //   getCommentsCounts(type, id, setCommentsCount)
  // }, [id, setCommentsCount, type]);


  const handleAddComment = async(id) => {
    setDisabledCreate(true)
    try {
      await addComment(authUser, id, comment, type, param.spaceId, postCommentAuthor, setGetCommentsLoading)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      // await getComments(type, id, setComments)
      setComment('')
      setSelectedId('')
      setDisabledCreate(false)
      // getCommentsCounts(type, id, setCommentsCount)
    }

  }
  const handleCancel = () => {
    setSelectedId('')
    setComment('')
  }
  
  const handleCommentsCount = async() => {
    setLoading(true)
    try {
      await getComments(type, id, setComments)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      setLoading(false)
      setShowComment(true)
    }
  }

  // For accessibility
  const toggleDrawer = (id) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setSelectedId(id)
  };
  const handleCloseDrawer = () => {
    toggleDrawer(false)
    setSelectedId('')
    setComment('')
  }
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        pl: '72px'
      }}
    >
      <LikeDislike id={id} type={type}/>
      <Button onClick={() => handleReplay(id)} size="small">Reply</Button>
      {comments.length > 0 &&
          <Button variant="outlined" size="small" onClick={handleCommentsCount} disabled={loading}>
          {comments.length} {comments.length === 1 ? 'replay' : 'replies'}
        </Button>
        }
        {comments.length > 0 && 
          <IconButton color="primary" size="small" aria-label="show hide comment list" onClick={() => setShowComment(i => i = !i)}>
            {showComment ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          </IconButton>
        }
    </Box>
      {selectedId === id && (
      <>
        <Drawer
          sx={{
            display: { xs: 'block', sm: 'none' },
            height: '100%',
            '.MuiDrawer-paper': {
              height: '100%',
          }
        }}
        anchor={'top'}
        open={selectedId === id}
        onClose={handleCloseDrawer}
      >
        {disabledCreate &&
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
          }
        {!disabledCreate &&
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: '8px 16px'
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1}}
              >
                Post Comment
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseOutlinedIcon/>
              </IconButton>
            </Box>
            <TextField
              fullWidth
              margin='normal'
              name='comment'            
              label="Comment"
              onChange={e => setComment(e.target.value)}
              multiline
              value={comment}
              variant='standard'
            />
              <Box
                sx={{
                  mt: 'auto',
                  display: 'flex',
                  gap: '15px',
                  p: '15px',
                  justifyContent: 'flex-end'
                }}
              >
                <Button variant="outlined" disabled={!comment} onClick={ () => handleAddComment(id)}>Comment</Button>
                <Button variant='text' onClick={handleCancel}>Cancel</Button>
            </Box>
          </>
        }
        </Drawer>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column'
          }}
        >
          {disabledCreate && 
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          }
          {!disabledCreate &&
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: '15px',
                  ml: '65px'
                }}
              >
                <CommonAvatar user={authUser} sx={{width: '30px', height: '30px'}}/>
                <TextField
                  fullWidth
                  margin='none'
                  name='comment'
                  onChange={e => setComment(e.target.value)}
                  multiline
                  value={comment}
                  variant='standard'
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  m: '15px 0',
                  gap: '15px',
                  justifyContent: 'flex-end'
                }}
              >
                <Button variant="outlined" size="small" disabled={!comment} onClick={() => handleAddComment(id)}>Comment</Button>
                <Button variant="outlined" size="small"onClick={handleCancel}>Cancel</Button>
              </Box>
            </>
          }
        </Box>
      </>
      )}
      
      {loading && <PostsCommentsSkeleton />}
      { disabledCreate && getCommentsLoading && <PostsCommentsSkeleton /> }
      {(comments && showComment && !loading) && comments.map(comment => (
        <PostsCommentList
          data={comment}
          key={comment.id}
          type={TYPE_COMMENT}
          id={comment.id}
          spaceAuthorUid={spaceAuthorUid}
        />
      ))}
    </>
  )
}

export default PostsComments