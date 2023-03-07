import { useNavigate } from 'react-router-dom'

// Contants
import { HOME_URL, NO_CREATED_SPACE, NO_JOINED_SPACE, PROFILE_URL, SPACES_URL } from '../../../constants'

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// component
import SpaceCardList from '../SpaceCardList/SpaceCardList'

// MUI components
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// Mui icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Grid, IconButton, Paper, Tooltip } from '@mui/material'

const UserProfile = ({isAuthUser, user, userJoinSpaces, userCreateSpaces, title, loadUserJoinSpaces, loadUserCreateSpaces}) => {
  const navigate = useNavigate()
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        align='center'
        sx={{
          textTransform: 'uppercase'
        }}
      >
        {title}
        {isAuthUser &&
          <Tooltip title='Edit profile'>  
            <IconButton
              onClick={() => navigate(`${PROFILE_URL}/edit`)}
              color="primary"
              aria-label="Edit profile">
              <ModeEditOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        }
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{
          mb: '32px',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} sm={12} lg={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection:'column',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={user?.displayName}
              src={user?.photoURL}
              sx={{ width: 100, height: 100, boxShadow: 2 }}
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
              
              {user?.biography && <Box
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
                    alt={user?.country?.label}
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
              }
            </Box>
          </Box>
        </Grid>
        {/* biography */}
        {user?.biography &&
        <Grid
          item xs={12} sm={12} lg={8}
          sx={{
            height: 'inherit'
          }}
        >
          <Paper
            sx={{
              p: '15px',
              height: '100%'
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 'light'
              }}
            >
              Biography
            </Typography>
            
            <Typography
              variant="caption"
              gutterBottom
              sx={{
                fontStyle: 'italic',              
                color: 'text.secondary'
              }}
            >
              {user?.biography}
            </Typography>
          </Paper>
        </Grid>
        }
      </Grid>
      {user?.interests && <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'light'
          }}
        >
          Interests
        </Typography>
        {user?.interests && <TagsInput value={user?.interests} disabled inputProps={{placeholder: ""}} />}
      </Box>
      }
      
      {/* Created space */}
      <SpaceCardList
        isLoading={loadUserCreateSpaces}
        spaces={userCreateSpaces}
        title="Created Spaces"
        noMessage={NO_CREATED_SPACE}
      >
        {isAuthUser && <Button onClick={() => navigate(`${SPACES_URL}/create`)}>Go to Create Some Spaces?</Button>}
      </SpaceCardList>
      
      {/* Joinded space */}
      <SpaceCardList
        isLoading={loadUserJoinSpaces}
        spaces={userJoinSpaces}
        title="Joined Spaces"
        noMessage={NO_JOINED_SPACE}
      >
        {isAuthUser && <Button onClick={() => navigate(HOME_URL)}>Go to Join Some Spaces?</Button>}
      </SpaceCardList>
    </>
  )
}

export default UserProfile
