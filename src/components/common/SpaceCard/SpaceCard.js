import { useNavigate } from "react-router-dom"

// MUI components
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Tooltip  from "@mui/material/Tooltip"

// component
import JoinLeaveBtn from '../JoinLeaveBtn/JoinLeaveBtn'
import UserAvatarGroup from '../UserAvatarGroup/UserAvatarGroup'
import CommonAvatar from "../CommonAvatar/CommonAvatar"
import DateTillToday from "../DateTillToday/DateTillToday"

// constatns
import { SPACES_URL, HOME_URL } from "../../../constants"

// context
import useSpaces from '../../../firebase/space'

const SpaceCard = ({space}) => {
  // Context
  const { fetchSpaces } = useSpaces()
  // Hook
  const navigate = useNavigate()

  // Event function
  const handleClickBtn = (e, url) => {
    e.stopPropagation();
    navigate(url)
  }

  const filterKeywordsForSpace = (e, keyword) => {
    e.stopPropagation();
    navigate(`${HOME_URL}?keywords=${keyword}`)
    fetchSpaces('keywords', 'array-contains', keyword)
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        height: '100%',
        "&:hover": {
          backgroundColor: 'rgba(0, 0, 0, .02)'
        },
      }} 
      onClick={(e) => handleClickBtn(e, `${SPACES_URL}/${space?.id}`)}
    >
      <Box>
        <CardHeader
          avatar={<CommonAvatar user={space?.author}/>}
          title={space?.title}
          subheader={space?.createdOn &&
            <DateTillToday date={space?.createdOn}/>
          }
          sx={{
            '.MuiCardHeader-title': {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '1',
              overflow: 'hidden'
            }
          }}
        />
        <CardMedia
          component="img"
          alt={space?.title}
          height="140"
          image={space?.thumbnail}
        />
        <CardContent>
          <Tooltip title={space?.overview}>
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '3',
                overflow: 'hidden',
              }}
            >
              {space?.overview}
            </Typography>
          </Tooltip>
          <br/>
          {/* User avatar group */}
          <UserAvatarGroup spaceId={space.id}/>
        </CardContent>
      </Box>
      <CardActions
        sx={{
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '15px',
          }}
        >
          {/* Shows space action btns */}
          {space && <JoinLeaveBtn space={space} />}
        </Box>
        <Box
          sx={{
            gap: '5px',
            ml: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}
        >
        {/* Show space keywords */}
        {space.keywords.map((keyword, index) => (
          <Chip key={index} variant="outlined" size="small" label={keyword}
          onClick={(e) => filterKeywordsForSpace(e, keyword)}
          />
        ))}
        </Box>
      </CardActions>
    </Card>
  )
}

export default SpaceCard