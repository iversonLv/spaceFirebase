import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './Space.css'

// MUI component
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Paper } from '@mui/material'

// Mui icons
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

// react tags
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// component
import  JoinLeaveBtn from '../common/JoinLeaveBtn/JoinLeaveBtn'
import  UserAvatarGroup from '../common/UserAvatarGroup/UserAvatarGroup'
import SpaceCardList from '../common/SpaceCardList/SpaceCardList'
import SpaceCardSkeleton from '../common/SpaceCardSkeleton/SpaceCardSkeleton'
import SpacePostsComments from '../common/SpacePostsComments/SpacePostsComments'
import CommonAvatar from '../common/CommonAvatar/CommonAvatar'
import DateTillToday from '../common/DateTillToday/DateTillToday'

// context
import useAuth from '../../firebase/auth'
import { getSpaceById, getRelatedSpaces } from '../../firebase/firestore'

// constants
import { SIGN_IN_UP_URL } from '../../constants'

// component
import SpaceSkeleton from '../common/SpaceSkeleton/SpaceSkeleton'

const Space = () => {
  const navigate = useNavigate();

  const params = useParams();
  const { authUser } = useAuth()
  const [space, setSpace] = useState({})

  const [relatedSpaces, setRelatedSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // load more will load more 3
  const [loadNumber, setLoadNumber] = useState(3)
  const [getSpaceByIdLoading, setGetSpaceByIdLoading] = useState(true)
  // get space
  useEffect(() => {
    const unscribe = async()=> {
      await getSpaceById(params.spaceId, setSpace, setGetSpaceByIdLoading)
    }
    unscribe()
  }, [params, authUser, setGetSpaceByIdLoading]);

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
      {getSpaceByIdLoading && <SpaceSkeleton />}
      {!!Object.keys(space).length && !getSpaceByIdLoading && (
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
            !authUser && <Button variant="outlined" onClick={() => navigate(SIGN_IN_UP_URL)}>Login to view comment</Button>
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
      {!Object.keys(space).length && !getSpaceByIdLoading && <Typography
        variant='h3'
      >
        Ops, seems the spaces is not available.
      </Typography>}
    </Container>
  )
}

export default Space