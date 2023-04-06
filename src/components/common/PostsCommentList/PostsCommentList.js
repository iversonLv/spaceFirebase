import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Markdown editor
import MDEditor from '@uiw/react-md-editor';

// Mui components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from "@mui/material"
// MUI icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// constants
import { TYPE_COMMENT, TYPE_POST, USERS_URL } from '../../../constants'

// components
import PostsComments from '../PostsComments/PostsComments';
import CommonAvatar from '../CommonAvatar/CommonAvatar';
import PostCommentAction from '../PostCommentAction/PostCommentAction';
import DateTillToday from '../DateTillToday/DateTillToday';
import DividerWithTitle from '../DividerWithTitle/DividerWithTitle';
import TextForm from '../TextForm/TextForm';

import useAuth from '../../../firebase/auth';
import { updateCommentPost } from '../../../firebase/firestore';

const PostsCommentList = ({data, type, id, spaceAuthorUid}) => {
  // Context
  const { authUser } = useAuth()
  // Hook
  const navigate = useNavigate()
  // Ref
  const postRef = useRef(null);
  // State
  const [editMode, setEditMode] = useState(false)
  const [post, setPost] = useState({title: data?.title, content: data?.content})
  const [disabledUpdatePost, setDisabledUpdatePost] = useState(false)
  const [comment, setComment] = useState(data?.content)
  const [disabledUpdated, setDisabledUpdated] = useState(false)

  // Event function
  const navigateUserPage = (uid) => navigate(`${USERS_URL}/${uid}`)

  const handleUpdateComment = async() => {
    setDisabledUpdated(true)
    try {
      await updateCommentPost(comment, type, id)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      // await getComments(type, id, setComments)
      setEditMode(false)
      setDisabledUpdated(false)
      // getCommentsCounts(type, id, setCommentsCount)
    }

  }
  
  const handleCancel = () => {
    setEditMode(false)
    setComment(data?.content)
  }

  const handleUpdatePost = async() => {
    setDisabledUpdatePost(true)
    try {
      await updateCommentPost(post, type, id)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      setEditMode(false)
      setDisabledUpdatePost(false)
    }
  }

  const handleCancelUpdatePost =() => {
    setEditMode(false)
    setPost({title: data?.title, content: data?.content})
  }

  // For accessibility
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setEditMode(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false)
    handleCancel()
  }
  return (
    <>
    <List sx={{ width: '100%', bgcolor: 'background.paper', pl: type === 'comment' ? '72px' : '0px' }} ref={postRef}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          {type === 'comment' && <CommonAvatar user={data?.author} sx={{width: '30px', height: '30px'}} />}
          {type === 'post' && <CommonAvatar user={data?.author} />}
        </ListItemAvatar>
        <Box
          sx={{width: '100%'}}
        >
          <ListItemText
            primary={data?.title}
            secondary={
              <>
                <Typography
                  sx={{
                    display: 'inline',
                    cursor: 'pointer',
                    bgcolor: spaceAuthorUid === data?.author?.uid ? 'rgba(0, 0, 0, .4)' : 'none',
                    p: '3px 5px',
                    borderRadius: '8px',
                    mr: '5px'
                }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                  onClick={() => navigateUserPage(data?.author?.uid)}
                >
                  {data?.author?.displayName}
                </Typography>
                
                <DateTillToday date={data?.createdOn} />
                <br/>
              </>
            }
          />
            {data?.postCommentAuthor && (
              <Button size="small" onClick={() => navigate(`${USERS_URL}/${data?.postCommentAuthor.uid}`)}>
                @{data?.postCommentAuthor?.displayName}
              </Button>
            )}
            {!editMode && <TextField
              fullWidth
              margin='none'
              name='comment'
              multiline
              defaultValue={data?.content}
              variant='standard'
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInput-root': {
                  '&:before, :after, :hover:not(.Mui-disabled):before': {
                    borderBottom: 0,
                  },
                },
              }}
            />}


      {editMode && type === TYPE_COMMENT && (
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
        open={editMode}
        onClose={handleCloseDrawer}
      >
         {disabledUpdated &&
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
          {!disabledUpdated &&
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
                  Comment
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
                <Button variant="outlined" disabled={!comment} onClick={ handleUpdateComment}>Update</Button>
                <Button variant='text'onClick={handleCancel}>Cancel</Button>
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
          {disabledUpdated && 
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
          {!disabledUpdated &&
            <>
              <TextField
                fullWidth
                margin='none'
                name='comment'
                onChange={e => setComment(e.target.value)}
                multiline
                value={comment}
                variant='standard'
              />
              <Box
                sx={{
                  display: 'flex',
                  m: '15px 0',
                  gap: '15px',
                  justifyContent: 'flex-end'
                }}
              >
                <Button variant="outlined" size="small" disabled={!comment} onClick={ handleUpdateComment}>Update</Button>
                <Button variant="text" size="small" onClick={handleCancel}>Cancel</Button>
              </Box>
            </>
          }
        </Box>
      </>
      )}

      {editMode && type === TYPE_POST && (
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
            open={editMode}
            onClose={handleCloseDrawer}
          >
            {disabledUpdatePost && 
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
            {!disabledUpdatePost && 
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
                    Post
                  </Typography>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseOutlinedIcon/>
                  </IconButton>
                </Box>
                <Divider/>
                  <TextForm
                    variant="standard"
                    name='postTitle'
                    value={post?.title || ''}
                    required={true}
                    disabled={disabledUpdatePost}
                    handleChange={(e) => setPost({...post, title: e.target.value})}
                    sx={{
                      flexGrow: 1,
                      mx: '15px',
                      width: 'auto',
                      mt: '15px'
                    }}
                    margin='none'
                  />
                  <MDEditor
                    visibleDragbar={false}
                    preview="edit"
                    height='50%'
                    value={post.content}
                    onChange={(value) => setPost({...post, content: value})}
                  />

                <DividerWithTitle title='Preview' />
                <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap', padding: '0 15px 15px', height: '30%' }} />
                <Box
                  sx={{
                    mt: 'auto'
                  }}
                >
                  <Divider/>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '15px',
                      p: '15px',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button variant="outlined" disabled={!post?.title || !post?.content} onClick={ handleUpdatePost}>Update</Button>
                    <Button variant="text">Cancel</Button>
                  </Box>
                </Box>
              </>
            }
            </Drawer>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              m: '15px 0',
              gap: '15px',
              alignItems: 'flex-start',
            }}
          >
            {disabledUpdatePost && 
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
          {!disabledUpdatePost && 
            <>
            <Box
              sx={{display: 'flex', gap: '15px', flexDirection: 'column', alignitems: 'stretch'}}
            >
                <TextForm
                  name='postTitle'
                  value={post?.title || ''}
                  required={true}
                  disabled={disabledUpdatePost}
                  handleChange={(e) => setPost({...post, title: e.target.value})}
                  sx={{
                    flexGrow: 1
                  }}
                  margin='none'
                />
                <MDEditor
                  value={post.content}
                  onChange={(value) => setPost({...post, content: value})}
                />
              </Box>
              {/* {id} {type} */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '15px',
                  p: '15px',
                  justifyContent: 'flex-end'
                }}
              >
                <Button variant="outlined" size="small" disabled={!post?.title || !post?.content} onClick={ handleUpdatePost}>Update</Button>
                <Button variant="text" size="small" onClick={handleCancelUpdatePost}>Cancel</Button>
              </Box>
              </>
            }
          </Box>
        </>
      )}

           
          {/* {data.id} */}
          </Box>
        
          {/* only author could update the post comment action */}
          {authUser?.uid === data?.author?.uid && 
            <PostCommentAction
              type={type}
              id={id}
              authUserId={authUser?.uid}
              uid={data?.author?.uid}
              spaceId={data?.spaceId}
              parentId={data?.parentId}
              postId={data?.postId}
              setEditMode={setEditMode}
            />
          }
        </ListItem>
      </List>
            {/* comment list */}
            <PostsComments
              type={type}
              editMode={editMode}
              setEditMode={setEditMode}
              id={id}
              spaceAuthorUid={spaceAuthorUid}
              source={data?.content}
              postCommentAuthor={data?.author}
            />
    </>
  )
}

export default PostsCommentList