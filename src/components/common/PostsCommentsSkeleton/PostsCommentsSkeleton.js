// Mui components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'

const PostsCommentsSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '15px'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rounded" width={312} height={60} />
        </Box>
      </Stack>
      <Stack spacing={1}>
        <Box
          sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '15px'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rounded" width={312} height={60} />
        </Box>
      </Stack>
    </Box>
  )
}

export default PostsCommentsSkeleton