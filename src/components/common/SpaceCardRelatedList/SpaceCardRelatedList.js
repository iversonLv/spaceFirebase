import { memo, useEffect, useState } from 'react'  
// Mui component
import { Box, Button, Grid, Typography } from '@mui/material'

// component
import  SpaceCard from '../SpaceCard/SpaceCard'
import  DividerWithTitle from '../DividerWithTitle/DividerWithTitle'
import SpaceCardSkeleton from '../SpaceCardSkeleton/SpaceCardSkeleton'

import { getRelatedSpaces, getSpaceKeywordsById } from '../../../firebase/firestore'
import { LOAD_MORE_NUMBER } from '../../../constants'
/**
 * @param  {} title: the dividerWithTitle, if not set will be undefinded, will not show the component
 * @param  {} noMessage: no list show the message
 * @param  {} children: if authUser need some data
 */
const SpaceCardRelatedList = memo(({spaceId, title, noMessage, children}) => {
  const [isLoading, setIsLoading] = useState(true)
  // load more will load more 3
  const [loadNumber, setLoadNumber] = useState(LOAD_MORE_NUMBER)
  
  const [relatedSpaces, setRelatedSpaces] = useState([])

  const [keywords, setKeywords] = useState([])

  useEffect(() => {
    getSpaceKeywordsById(spaceId, setKeywords)
  }, [spaceId]);

  useEffect(() => {
    //TODO: Here will reload as the getspace is onsnapshot, need refacotr
      getRelatedSpaces(keywords, spaceId, setRelatedSpaces, setIsLoading)
  }, [keywords, spaceId])

  const loadingMoreRelatedSpaced = () => {
    let n = loadNumber + 3
    n > relatedSpaces.length ? setLoadNumber(relatedSpaces.length) : setLoadNumber(n)
  }

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
      : relatedSpaces.length === 0 
        ? 
          <>
            <NoMessageBlock/>
            {children}
          </>
        : <Grid container spacing={4}>
            {relatedSpaces.slice(0, loadNumber).map(space => (
              <Grid item xs={12} sm={6} lg={4} key={space.id}>
                <SpaceCard space={space} key={space.id} />
              </Grid>
            ))}
          </Grid>
    }
    {!isLoading && relatedSpaces.length > loadNumber  && 
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            m: '10px 0'
          }}
        >
          <Button onClick={loadingMoreRelatedSpaced}>Load More</Button>
        </Box>
      }
    </>
  )
})

export default SpaceCardRelatedList