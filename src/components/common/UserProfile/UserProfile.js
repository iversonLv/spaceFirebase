import { useNavigate } from 'react-router-dom'

// Contants
import { HOME_URL, SPACES_URL } from '../../../constants'

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// component
import SpaceCardList from '../SpaceCardList/SpaceCardList'

// MUI components
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SpaceCardSkeleton from '../SpaceCardSkeleton/SpaceCardSkeleton'
import DividerWithTitle from '../DividerWithTitle/DividerWithTitle'

const UserProfile = ({isAuthUser, user, userJoinSpaces, userCreateSpaces, title, loadUserJoinSpaces, loadUserCreateSpaces}) => {
  const navigate = useNavigate()
  return (
    <Container>
      <Typography
        variant="h3"
        gutterBottom
        align='center'
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection:'column',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <Avatar
          alt={user?.displayName}
          src={user?.photoURL}
          sx={{ width: 100, height: 100 }}
        >
            {user?.displayName}
        </Avatar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: '5px'
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
          >
            {user?.displayName}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${user?.country?.value.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${user?.country?.value.toLowerCase()}.png 2x`}
                alt=""
              />
            <Typography
              variant="caption"
              sx={{
                fontStyle: 'italic'
              }}
            >
              {user?.country?.label} ({user?.country?.value})
            </Typography>
          </Box>
        </Box>

      </Box>
      <Box>
        <Typography
          variant="body1"
          gutterBottom
        >
          Interests
        </Typography>
        {user?.interests && <TagsInput value={user?.interests} disabled inputProps={{placeholder: ""}} />}
      </Box>
      
      { loadUserCreateSpaces
        ? <SpaceCardSkeleton />
        : !userCreateSpaces.length
          ? 
          <>
            <DividerWithTitle title='Created Spaces'/>
            {isAuthUser ? <Button onClick={() => navigate(`${SPACES_URL}/create`)}>Go to Create Some Spaces?</Button> : 'Current user hasn\'t created any space yet' }
          </>

          : <SpaceCardList spaces={userCreateSpaces} title="Created Spaces" />
      }
      { loadUserJoinSpaces
        ? <SpaceCardSkeleton />
        : !userJoinSpaces.length
          ? 
          <>
            <DividerWithTitle title='Joined Spaces'/>
            {isAuthUser ? <Button onClick={() => navigate(HOME_URL)}>Go to Join Some Spaces?</Button> : 'Current user hasn\'t joined any space yet'}
          </>
          : <SpaceCardList spaces={userJoinSpaces} title="Joined Spaces" />
      }
    </Container>
  )
}

export default UserProfile
