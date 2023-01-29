import { useState, useEffect } from "react"

// Mui components
import {
  Box,
  Button,
  IconButton
 } from "@mui/material";

//  Mui icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { getComments, addComment } from "../../../firebase/firestore";

// Markdown editor
import MDEditor from '@uiw/react-md-editor';
import useAuth from "../../../firebase/auth";
import { useParams } from "react-router-dom";
import { TYPE_COMMENT } from "../../../constants";
import LikeDislike from "../LikeDislike/LikeDislike";
import PostsCommentsSkeleton from "../PostsCommentsSkeleton/PostsCommentsSkeleton";
import PostsCommentList from "../PostsCommentList/PostsCommentList";
import CommonAvatar from "../CommonAvatar/CommentAvatar";

const PostsComments = ({id, spaceAuthorUid, type}) => {
  const param = useParams()
  const { authUser } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])

  const [disabledCreate, setDisabledCreate] = useState(false)
  const [showComment, setShowComment] = useState(false)
  
  const [selectedId, setSelectedId] = useState('')
  
  
  const [comment, setComment] = useState('')
  const handleReplay = (id) => {
    setSelectedId(id)
  }
  // get posts
  // useEffect(() => {
  //   // const fetchComments = async() => {
  //   //   await getComments(id, setComments)
  //   // }
  //   // fetchComments()
  //   getCommentsCounts(type, id, setCommentsCount)
  // }, [id, setCommentsCount, type]);

  useEffect(() => {
    const fetchComments = async() => {
      await getComments(type, id, setComments)
    }

    return () => {
      fetchComments()
    }
  }, [id, type]);

  const handleAddComment = async(id) => {
    setDisabledCreate(true)
    await addComment(authUser, id, comment, type, param.spaceId)
    // await getComments(type, id, setComments)
    setComment('')
    setSelectedId('')
    setDisabledCreate(false)
    // getCommentsCounts(type, id, setCommentsCount)

  }
  const handleCancel = () => {
    setSelectedId('')
    setComment('')
  }
  
  const handleCommentsCount = async() => {
    setLoading(true)
    await getComments(type, id, setComments)
    setLoading(false)
    setShowComment(true)
  }
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center'
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
      <Box
        sx={{
          display: 'flex',
          margin: '15px 0',
          gap: '15px',
          alignItems: 'flex-start',
        }}
      >
        <CommonAvatar user={authUser}/>
        <MDEditor
          style={{width: '500px'}}
          value={comment}    
          onChange={(value) => setComment(value)}
          height={100}
          hideToolbar={true}
        />
        <Button variant="outlined" size="small" disabled={disabledCreate || !comment} onClick={() => handleAddComment(id)}>Comment</Button>
        <Button variant="outlined" size="small" onClick={handleCancel}>Cancel</Button>
      </Box>)}
      
      {loading && <PostsCommentsSkeleton />}
      { disabledCreate && <PostsCommentsSkeleton /> }
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