import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

// MUI components
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// components
import SpaceCard from '../common/SpaceCard/SpaceCard'
import SapceCardSkeleton from '../common/SpaceCardSkeleton/SpaceCardSkeleton'

// context
import useAuth from '../../firebase/auth'
import useSpaces from '../../firebase/space'

// constants
import { HOME_URL } from '../../constants'

const Home = () => {
  const [queryParameters] = useSearchParams()
  const navigate = useNavigate()
  const { authUser } = useAuth()
  const { spaces, fetchSpaces, isLoading } = useSpaces()
  const [keyword, setKeyword] = useState(queryParameters.get('keywords'))

  useEffect(() => {
    setKeyword(queryParameters.get('keywords'))
    if (!queryParameters.get('keywords')) {
      fetchSpaces()
    } else {
      fetchSpaces('keywords', 'array-contains', queryParameters.get('keywords'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParameters]);


  const handleDeleteKeyword = () => {
    setKeyword('')
    navigate(HOME_URL)
    fetchSpaces()
  }

  
  return (
      <Container>
      {!authUser && 
        (
          <Typography
              variant="h3"
              gutterBottom
              align='center'
            >
              Sign up to start learning
          </Typography>
      )}
      {authUser && 
        <Typography
            variant="h3"
            gutterBottom
            align='center'
          >
            Join a learning space below
        </Typography>
      }
      <Box>
        <Typography
            variant="h5"
            gutterBottom
          >
            Co-learning Spaces
        </Typography>
        {keyword && (
          <Box sx={{marginBottom: '15px'}}>
          <Typography
              variant="caption"
              gutterBottom
            >
              Filter by keyword: 
          </Typography>
          <Chip label={keyword} variant="outlined" onDelete={handleDeleteKeyword} />
          </Box>
        )}
      </Box>
      {
        isLoading ?
          <SapceCardSkeleton />
        : !spaces.length
          ?
          <Typography
              variant="h6"
              gutterBottom
              align='center'
            >
              No spaces currectly.
          </Typography>
          :
          <Box
            sx={{
              display: 'flex',
              gap: '25px',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}
          >
            {spaces.map((space) => (
              <SpaceCard space={space} key={space.id} />
            ))}
          </Box>
      }
    </Container>
  )
}

export default Home