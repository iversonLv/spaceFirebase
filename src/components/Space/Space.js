import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './Space.css'

// MUI component
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'


// icons
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

// component
import  JoinLeaveBtn from '../common/JoinLeaveBtn/JoinLeaveBtn'
import  UserAvatarGroup from '../common/UserAvatarGroup/UserAvatarGroup'
import SpaceCardList from '../common/SpaceCardList/SpaceCardList'

// context
import useAuth from '../../firebase/auth'
import { getSpaceById, getRelatedSpaces } from '../../firebase/firestore'

import { Paper } from '@mui/material'
import SpaceCardSkeleton from '../common/SpaceCardSkeleton/SpaceCardSkeleton'
import SpacePostsComments from '../common/SpacePostsComments/SpacePostsComments'
import CommonAvatar from '../common/CommonAvatar/CommentAvatar'
import DateTillToday from '../common/DateTillToday/DateTillToday'
import { LOGIN_URL } from '../../constants'

const Space = ({setLoading}) => {
  const navigate = useNavigate();

  const params = useParams();
  const { authUser } = useAuth()
  const [space, setSpace] = useState({})

  const [relatedSpaces, setRelatedSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // load more will load more 3
  const [loadNumber, setLoadNumber] = useState(3)
  // get space
  useEffect(() => {
    const fetchSpaceById = async() => {
    setLoading(true)
    await getSpaceById(params.spaceId, setSpace)
    setLoading(false)
    }
    fetchSpaceById()
  }, [params, authUser, setLoading]);

  useEffect(() => {
      getRelatedSpaces(space?.keywords, space?.id, setRelatedSpaces, setIsLoading)
  }, [space])

  const loadingMoreRelatedSpaced = () => {
    let n = loadNumber + 3
    console.log(n, relatedSpaces.length)
    n > relatedSpaces.length ? setLoadNumber(relatedSpaces.length) : setLoadNumber(n)
  }

  const handleBackArrow = () => {
    // console.log(pathname)
    navigate(-1)
  }

  return (
    <Container>
      {space && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <IconButton color="primary" aria-label="back" variant="outlined" onClick={handleBackArrow}>
                <ArrowBackIosNewOutlinedIcon/>
              </IconButton>
              {space?.title}
            </Typography>
              {space && <JoinLeaveBtn space={space}/>}
          </Box>
          <Paper elevation={0}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >            
            <Box
              sx={{
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              By
              <CommonAvatar user={space?.author} />
              <DateTillToday date={space?.createdOn} />
            </Box>
            <Paper
              elevation = {0}
              sx={{
                marginBottom: '0.35em',
              }}
            >
              
              <UserAvatarGroup spaceId={params.spaceId}/>
            </Paper>
          </Paper>
          <img src={space?.thumbnail} alt={space?.title} className='thumbnail' />
          <Box
            sx={{
              display: 'flex',
              gap: '50px',
            }}
          >
            <Box
              sx={{
                flex: '2'
              }}
            >
              <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    '&::first-letter': {
                      fontSize: '3em',
                      lineHeight: '1em'
                    }
                  }}
                >
                  {space.overview}
              </Typography>
            </Box>
            <Box 
              sx={{
                flex: '1',
                padding: '10px'
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                align='center'
              >
                Prerequisites
              </Typography>
              {space?.prerequisites && <TagsInput value={space?.prerequisites} disabled inputProps={{placeholder: ""}} />}
              
            </Box>
          </Box>

          {/* posts */}
          {
           authUser && <SpacePostsComments spaceId={space?.id} spaceAuthorUid={space?.author?.uid}/>
          }
          {
            !authUser && <Button variant="outlined" onClick={() => navigate(LOGIN_URL)}>Login to view comment</Button>
          }
          {isLoading ? <SpaceCardSkeleton />
            : 
            <>
              <SpaceCardList spaces={relatedSpaces.slice(0, loadNumber)} title="Related Spaces" />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '10px 0'
                }}
              >
                {relatedSpaces.length > loadNumber  && <Button onClick={loadingMoreRelatedSpaced}>Load More</Button>}
              </Box>
            </>
          }
        </>
      )}
    </Container>
  )
}

export default Space