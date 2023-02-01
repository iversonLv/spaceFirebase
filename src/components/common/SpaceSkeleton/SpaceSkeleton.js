// Mui components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import { Typography } from '@mui/material'

const SpaceSkeleton = () => {
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
          <Skeleton variant="rounded" width={54} height={54} />
          <Skeleton variant="rounded" sx={{flexGrow: 1}} height={54} />
          <Skeleton variant="rounded" width={100} height={54} />
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
          <Skeleton variant="circular" width={54} height={54} />
          <Box sx={{marginLeft: 'auto', display: 'flex',}}>
            <Skeleton variant="circular" width={54} height={54} />
            <Skeleton variant="circular" width={54} height={54}/>
          </Box>
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
          <Skeleton variant="rounded" height={300} width={'100%'} />
        </Box>
      </Stack>
      <Stack spacing={1}>
        <Box
          sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
          }}
        >
          <Typography variant="body1" sx={{flexGrow: .7}}>
            <Skeleton />
          </Typography>
          <Typography variant="body1" sx={{flexGrow: .3}}>
            <Skeleton />
          </Typography>
        </Box>
        <Box
          sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
          }}
        >
          <Typography variant="body1" sx={{flexGrow: .7}}>
            <Skeleton />
          </Typography>
          <Typography variant="body1" sx={{flexGrow: .3}}>
            <Skeleton />
          </Typography>
        </Box>
        <Box
          sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
          }}
        >
          <Typography variant="body1" sx={{flexGrow: .7}}>
            <Skeleton />
          </Typography>
          <Typography variant="body1" sx={{flexGrow: .3}}>
            <Skeleton />
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default SpaceSkeleton