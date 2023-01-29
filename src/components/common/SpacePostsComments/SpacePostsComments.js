import { useState, useEffect } from "react";

// context
import useAuth from '../../../firebase/auth'
import { addPost, getPosts } from '../../../firebase/firestore'

// Markdown editor
import MDEditor from '@uiw/react-md-editor';

// Mui components
import {
  Box,
  Button,
} from "@mui/material"

// Components
import DividerWithTitle from "../DividerWithTitle/DividerWithTitle"
import TextForm from "../TextForm/TextForm"


// constants
import PostsCommentList from "../PostsCommentList/PostsCommentList";
import PostsCommentsSkeleton from "../PostsCommentsSkeleton/PostsCommentsSkeleton";
import { TYPE_POST } from "../../../constants";

const SpacePostsComments = ({spaceAuthorUid, spaceId}) => {

  const { authUser } = useAuth()

  const [loading, setLoading] = useState(false)
  
  const [post, setPost] = useState({title: '', content: ''})
  const [posts, setPosts] = useState([])
  const [disabledCreatePost, setDisabledCreatePost] = useState(false)
  


  
  // get posts
  useEffect(() => {
    const fetchPosts = async() => {
      setLoading(true)
      await getPosts(spaceId, setPosts)
      setLoading(false)
    }
    fetchPosts()
  }, [spaceId, setLoading]);


  const handleCreatePost = async() => {
    // Click the create the post, the create btn should be disabled
    setDisabledCreatePost(true)
    await addPost(authUser, post, spaceId)
    // after add the post, the create post form fields should reset
    setPost({title: '', content: ''})
    // after add the post, the create btn should be enable again
    setDisabledCreatePost(false)
  }

  return (
    <>
      <DividerWithTitle title='Posts'/>
      <Box
        component="form"
        sx={{
          '& > :not(style)' : { m :1},
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <TextForm
            name='postTitle'
            value={post?.title || ''}
            size="small"
            required={true}
            disabled={disabledCreatePost}
            handleChange={(e) => setPost({...post, title: e.target.value})}
            sx={{
              flexGrow: 1
            }}
            margin='none'
          />
          
          <Button
            sx={{width: '170px'}}
            variant="outlined"
            disabled={disabledCreatePost || (!post?.title || !post?.content)}
            onClick={handleCreatePost}
          >
            Create a Post
          </Button>
        </Box>
        <MDEditor
          value={post.content}
          onChange={(value) => setPost({...post, content: value})}
        />
      </Box>
      
      {loading && <PostsCommentsSkeleton />}
      { disabledCreatePost && <PostsCommentsSkeleton /> }
      {(posts && !loading) && posts.map(post => (
        <PostsCommentList
          data={post}
          key={post.id}
          type={TYPE_POST}
          id={post.id}
          spaceAuthorUid={spaceAuthorUid}
        />
      ))}
    </>
  )
}

export default SpacePostsComments