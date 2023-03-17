import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

// MUI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'


// context
import useAuth from '../../firebase/auth'
import useSpaces from '../../firebase/space'

// constants
import { HOME_URL, NO_SPACE } from '../../constants'
import DividerWithTitle from '../common/DividerWithTitle/DividerWithTitle'
import SpaceCardList from '../common/SpaceCardList/SpaceCardList'

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
      <>
      {!authUser && 
        (
          <Typography
              variant="h4"
              gutterBottom
              align='center'
              sx={{
                textTransform: 'uppercase'
              }}
            >
              Sign up to start learning
          </Typography>
      )}
      {authUser && 
        <Typography
            variant="h4"
            gutterBottom
            align='center'
            sx={{
              textTransform: 'uppercase'
            }}
          >
            Join a learning space below
        </Typography>
      }
      <Box>
        <DividerWithTitle title='Co-learning Spaces'/>
        {keyword && (
          <Box sx={{
            mb: '15px'
          }}>
          <Typography
              variant="caption"
              gutterBottom
              sx={{
                fontStyle: 'italic',
                pr: '15px'
              }}
            >
              Filter by keyword: 
          </Typography>
          <Chip label={keyword} variant="outlined" onDelete={handleDeleteKeyword} />
          </Box>
        )}
      </Box>
      <SpaceCardList
        spaces={spaces} 
        isLoading={isLoading}
        noMessage={NO_SPACE}
      />
    </>
  )
}

export default Home