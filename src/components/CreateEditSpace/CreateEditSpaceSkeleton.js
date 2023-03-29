// Mui components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid'

const CreateEditSpaceSkeleton = () => {
  return (
    // title bar
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

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} lg={4}>
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
        </Grid>
        <Grid item xs={12} sm={12} lg={8}>
          <Stack spacing={1}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} lg={12}>
                <Skeleton height={54}/>
                <Skeleton height={104}/>
                <Skeleton height={54}/>
                <Skeleton height={54}/>
                <Skeleton variant="rounded" width={64} height={30} />
              </Grid>
              
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreateEditSpaceSkeleton