// Mui components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import { Grid, Typography } from '@mui/material'

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
          <Box sx={{ml: 'auto', display: 'flex',}}>
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
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} lg={8}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} lg={8}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>
          
          <Grid item sm={12} lg={8}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Typography variant="body1">
              <Skeleton />
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

export default SpaceSkeleton