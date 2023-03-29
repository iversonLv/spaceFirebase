import { memo } from 'react'  
// Mui component
import { Grid, Typography } from '@mui/material'

// component
import  SpaceCard from '../SpaceCard/SpaceCard'
import  DividerWithTitle from '../DividerWithTitle/DividerWithTitle'
import SpaceCardSkeleton from '../SpaceCard/SpaceCardSkeleton'
/**
 * @param  {} isLoading: loading show skeleton, then load no message or space card list
 * @param  {} spaces: spaces data
 * @param  {} title: the dividerWithTitle, if not set will be undefinded, will not show the component
 * @param  {} noMessage: no list show the message
 * @param  {} children: if authUser need some data
 */
const SpaceCardList = memo(({isLoading, spaces, title, noMessage, children}) => {
  const NoMessageBlock = () => (
    <Typography
      variant="body2"
      gutterBottom
      align='center'
    >
      {noMessage}
  </Typography>
  )
  return (
    <>
    {!!title && <DividerWithTitle title={title}/>}
    {isLoading
      ? <SpaceCardSkeleton /> 
      : spaces.length === 0 
        ? 
          <>
            <NoMessageBlock/>
            {children}
          </>
        : <Grid container spacing={4}>
            {spaces.map(space => (
              <Grid item xs={12} sm={6} lg={4} key={space.id}>
                <SpaceCard space={space} key={space.id} />
              </Grid>
            ))}
          </Grid>
    }
    </>
  )
})

export default SpaceCardList