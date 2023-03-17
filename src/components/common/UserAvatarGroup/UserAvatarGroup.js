import { useState, useEffect, memo } from 'react'

// MUI components
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


import { getSpaceActiveUsers } from '../../../firebase/firestore'
import CommonAvatar from '../CommonAvatar/CommonAvatar'

const UserAvatarGroup = memo(({spaceId}) => {
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    getSpaceActiveUsers(spaceId, setActiveUsers)
  }, [spaceId, setActiveUsers]);
  
  return (
    <Box
      sx={{
        display: 'flex',
        height: '44px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary'
        }}
      >
          Total members: {activeUsers?.length}
      </Typography>
      <AvatarGroup
        sx={{
          flexWrap: 'wrap'
        }}
      >
        {activeUsers && activeUsers.map(activeUser => (
          <CommonAvatar user={activeUser} key={activeUser.uid}/>
          ))}
      </AvatarGroup>
    </Box>
  )
})

export default UserAvatarGroup