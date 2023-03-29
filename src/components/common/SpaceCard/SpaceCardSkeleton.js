// Mui components
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';


const SpaceCardSkeleton = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{
            height: '100%',
          }}>
          <CardHeader
            avatar={
              <Skeleton animation="wave" variant="circular" width={40} height={40} />
            }
            action={null}
            title={
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ mb: 6 }}
              />
            }
            subheader={
              <Skeleton animation="wave" height={10} width="40%" />
            }
          />
          <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
          <CardContent>
              <>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
              </>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SpaceCardSkeleton