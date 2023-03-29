import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Markdown editor
import MDEditor from '@uiw/react-md-editor';

// Mui components
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material"

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// constants
import { TYPE_COMMENT, TYPE_POST, USERS_URL } from '../../../constants'
import PostsComments from '../PostsComments/PostsComments';
import PostCommentAction from '../PostCommentAction/PostCommentAction';
import useAuth from '../../../firebase/auth';
import { updateCommentPost } from '../../../firebase/firestore';
import TextForm from '../TextForm/TextForm';
import CommonAvatar from '../CommonAvatar/CommonAvatar';
import DateTillToday from '../DateTillToday/DateTillToday';
import DividerWithTitle from '../DividerWithTitle/DividerWithTitle';

const PostsCommentList = ({data, type, id, spaceAuthorUid}) => {
  const postRef = useRef(null);
  const { authUser } = useAuth()
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const navigateUserPage = (uid) => {
    navigate(`${USERS_URL}/${uid}`)
  }


  const [post, setPost] = useState({title: data?.title, content: data?.content})
  const [disabledUpdatePost, setDisabledUpdatePost] = useState(false)
  
  const [comment, setComment] = useState(data?.content)
  const [disabledUpdated, setDisabledUpdated] = useState(false)

  const handleUpdateComment = async() => {
    setDisabledUpdated(true)
    await updateCommentPost(comment, type, id)
    // await getComments(type, id, setComments)
    setEditMode(false)
    setDisabledUpdated(false)
    // getCommentsCounts(type, id, setCommentsCount)

  }
  const handleCancel = () => {
    setEditMode(false)
    setComment(data?.content)
  }

  const handleUpdatePost = async() => {
    setDisabledUpdatePost(true)
    await updateCommentPost(post, type, id)
    setEditMode(false)
    setDisabledUpdatePost(false)
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
            {!editMode && <MDEditor.Markdown source={data?.content} />}


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
          <MDEditor
            visibleDragbar={false}
            value={comment}    
            onChange={(value) => setComment(value)}
            preview="edit"
            hideToolbar={true}
            height='50%'
          />
          <DividerWithTitle title='Preview' />
          <MDEditor.Markdown source={comment} style={{ whiteSpace: 'pre-wrap', padding: '0 15px 15px', height: '30%' }} />
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
              <Button variant="outlined" disabled={disabledUpdated || !comment} onClick={ handleUpdateComment}>Update</Button>
              <Button variant='text' onClick={handleCancel}>Cancel</Button>
            </Box>
          </Box>
        </Drawer>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            m: '15px 0',
            gap: '15px',
            alignItems: 'flex-start',
          }}
        >
          <MDEditor
            style={{width: '500px'}}
            value={comment}    
            onChange={(value) => setComment(value)}
            height={100}
            hideToolbar={true}
          />
          {id} {type}
          <Button variant="outlined" size="small" disabled={disabledUpdated || !comment} onClick={ handleUpdateComment}>Update</Button>
          <Button variant="text" size="small" onClick={handleCancel}>Cancel</Button>
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
                  <Button variant="outlined" disabled={disabledUpdatePost || (!post?.title || !post?.content)} onClick={ handleUpdatePost}>Update</Button>
                  <Button variant="text" onClick={handleCancelUpdatePost}>Cancel</Button>
                </Box>
              </Box>
            </Drawer>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              m: '15px 0',
              gap: '15px',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{display: 'flex', gap: '15px', flexDirection: 'column'}}
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
                style={{width: '500px'}}
                value={post.content}
                onChange={(value) => setPost({...post, content: value})}
              />
            </Box>
            {id} {type}
            <Button variant="outlined" size="small" disabled={disabledUpdatePost || (!post?.title || !post?.content)} onClick={ handleUpdatePost}>Update</Button>
            <Button variant="text" size="small" onClick={handleCancelUpdatePost}>Cancel</Button>
          </Box>
        </>
      )}






           
          {/* {data.id} */}
          </Box>
        
          
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