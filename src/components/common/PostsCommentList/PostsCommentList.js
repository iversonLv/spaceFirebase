import { useState} from 'react'
import { useNavigate } from 'react-router-dom'

// Markdown editor
import MDEditor from '@uiw/react-md-editor';

// Mui components
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material"

// constants
import { TYPE_COMMENT, TYPE_POST, USERS_URL } from '../../../constants'
import PostsComments from '../PostsComments/PostsComments';
import PostCommentAction from '../PostCommentAction/PostCommentAction';
import useAuth from '../../../firebase/auth';
import { updateCommentPost } from '../../../firebase/firestore';
import TextForm from '../TextForm/TextForm';
import CommonAvatar from '../CommonAvatar/CommentAvatar';
import DateTillToday from '../DateTillToday/DateTillToday';

const PostsCommentList = ({data, type, id, spaceAuthorUid}) => {
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



  
  return (
    <>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <CommonAvatar user={data?.author} />
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
                    paddingRight: '10px',
                    cursor: 'pointer',
                    backgroundColor: spaceAuthorUid === data?.author?.uid ? 'rgba(0, 0, 0, .4)' : 'none',
                    padding: '3px 5px',
                    borderRadius: '8px',
                    marginRight: '5px'
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
            {!editMode && <MDEditor.Markdown source={data?.content} />}



      {editMode && type === TYPE_COMMENT && (
      <Box
        sx={{
          display: 'flex',
          margin: '15px 0',
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
        <Button variant="outlined" size="small" onClick={handleCancel}>Cancel</Button>
      </Box>)}

      {editMode && type === TYPE_POST && (
      <Box
        sx={{
          display: 'flex',
          margin: '15px 0',
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
            size="small"
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
        <Button variant="outlined" size="small" onClick={handleCancelUpdatePost}>Cancel</Button>
      </Box>)}









            
          {data.id}
            {/* comment list */}
            <PostsComments
              type={type}
              editMode={editMode}
              setEditMode={setEditMode}
              id={id}
              spaceAuthorUid={spaceAuthorUid}
              source={data?.content}
            />
          </Box>
        
          {(data?.author?.uid === authUser.uid) && <PostCommentAction type={type} id={id} uid={data?.author?.uid} spaceId={data?.spaceId} parentId={data?.parentId} postId={data?.postId} setEditMode={setEditMode}/>}
        </ListItem>
      </List>
      </>
  )
}

export default PostsCommentList