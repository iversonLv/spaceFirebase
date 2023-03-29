import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './Space.css'

// MUI component
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Chip, Grid, Paper } from '@mui/material'

// react tags
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// component
import  JoinLeaveBtn from '../common/JoinLeaveBtn/JoinLeaveBtn'
import  UserAvatarGroup from '../common/UserAvatarGroup/UserAvatarGroup'
import SpaceCardRelatedList from '../common/SpaceCardRelatedList/SpaceCardRelatedList'
import SpacePostsComments from '../common/SpacePostsComments/SpacePostsComments'
import CommonAvatar from '../common/CommonAvatar/CommonAvatar'
import DateTillToday from '../common/DateTillToday/DateTillToday'

// context
import useAuth from '../../firebase/auth'
import { getSpaceById } from '../../firebase/firestore'

// constants
import { HOME_URL, NO_RELATED_SPACE, NO_SUCH_SPACE, SIGN_IN_UP_URL } from '../../constants'

// component
import SpaceSkeleton from '../common/SpaceSkeleton/SpaceSkeleton'
import useSpaces from '../../firebase/space'
import DividerWithTitle from '../common/DividerWithTitle/DividerWithTitle'
import BackArrowTitleWithActionBtn from '../common/BackArrowTitleWithActionBtn/BackArrowTitleWithActionBtn'

const Space = () => {
  const navigate = useNavigate();

  const params = useParams();
  const { authUser } = useAuth()
  const { fetchSpaces } = useSpaces()
  const [space, setSpace] = useState({})

  const [getSpaceByIdLoading, setGetSpaceByIdLoading] = useState(true)
  // get space
  useEffect(() => {
    const unscribe = async()=> {
      await getSpaceById(params.spaceId, setSpace, setGetSpaceByIdLoading)
    }
    unscribe()
    return () => unscribe()
  }, [params.spaceId, setGetSpaceByIdLoading]);

  const filterKeywordsForSpace = (e, keyword) => {
    e.stopPropagation();
    navigate(`${HOME_URL}?keywords=${keyword}`)
    fetchSpaces('keywords', 'array-contains', keyword)
  }

  return (
    <>
      {getSpaceByIdLoading && <SpaceSkeleton />}
      {!!Object.keys(space).length && !getSpaceByIdLoading && (
        <>
          <BackArrowTitleWithActionBtn
            title={space?.title}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '15px'
              }}
            >
              {space && <JoinLeaveBtn space={space}/>}
            </Box>
          </BackArrowTitleWithActionBtn>
          
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

              <Box
                sx={{
                  gap: '5px',
                  ml: '15px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}
              >

              {space.keywords.map((keyword, index) => (
                <Chip key={index} variant="outlined" size="small" label={keyword}
                onClick={(e) => filterKeywordsForSpace(e, keyword)}
                />
              ))}
              </Box>
            </Box>
            <Paper
              elevation = {0}
              sx={{
                mb: '0.35em',
              }}
            >
              
              <UserAvatarGroup spaceId={params.spaceId}/>
            </Paper>
          </Paper>
          <img src={space?.thumbnail} alt={space?.title} className='thumbnail' />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} lg={8}>
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
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <Box 
                sx={{
                  flex: '1',
                  p: '10px'
                }}
              >
                <DividerWithTitle title='Prerequisites'/>
                {space?.prerequisites && <TagsInput value={space?.prerequisites} disabled inputProps={{placeholder: ""}} />}
                
              </Box>
            </Grid>
          </Grid>

          {/* posts */}
          {
           authUser && <SpacePostsComments spaceId={space?.id} spaceAuthorUid={space?.author?.uid}/>
          }
          {
            !authUser && <Button variant="outlined" size='small' onClick={() => navigate(SIGN_IN_UP_URL)}>Login to view post</Button>
          }
          <SpaceCardRelatedList
            spaceId={params.spaceId}
            title="Related Spaces"
            noMessage={NO_RELATED_SPACE}
          />
        </>
      )}
      {!Object.keys(space).length && !getSpaceByIdLoading &&
      <Typography
        variant="h4"
        gutterBottom
        align='center'
        sx={{
          textTransform: 'uppercase'
        }}
      >
        {NO_SUCH_SPACE}
      </Typography>}
    </>
  )
}

export default Space