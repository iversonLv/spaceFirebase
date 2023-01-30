// Mui components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'

const SpaceCardSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: '15px'
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
        <Skeleton variant="rectangular" width={367} height={140} />
        <Skeleton variant="rounded" width={367} height={140} />
      </Stack>
    </Box>
  )
}

export default SpaceCardSkeleton