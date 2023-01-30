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

// component
import JoinLeaveBtn from '../JoinLeaveBtn/JoinLeaveBtn'
import UserAvatarGroup from '../UserAvatarGroup/UserAvatarGroup'
// constatns
import { SPACES_URL, HOME_URL } from "../../../constants"

// context
import useSpaces from '../../../firebase/space'
import CommonAvatar from "../CommonAvatar/CommonAvatar"
import DateTillToday from "../DateTillToday/DateTillToday"

const SpaceCard = ({space}) => {
  const { fetchSpaces } = useSpaces()
  
  const navigate = useNavigate()

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
        width: 367,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
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
        />
        <CardMedia
          component="img"
          alt={space?.title}
          height="140"
          image={space?.thumbnail}
        />
        <CardContent>
          <Typography variant="body2">
            {space?.overview}
          </Typography>
          <br/>
          
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
            marginBottom: '15px',
          }}
        >
          {space && <JoinLeaveBtn space={space} listOrDetail='list'/>}
          
          
        </Box>
        <Box
          sx={{
            gap: '5px',
            marginLeft: 0,
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
      </CardActions>
    </Card>
  )
}

export default SpaceCard