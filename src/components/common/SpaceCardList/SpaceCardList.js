// Mui component
import Box from '@mui/material/Box'

// component
import  SpaceCard from '../SpaceCard/SpaceCard'
import  DividerWithTitle from '../DividerWithTitle/DividerWithTitle'

const SpaceCardList = ({spaces, title}) => {
  return (
    <>
    <DividerWithTitle title={title}/>
    <Box
      sx={{
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}
    >
      {spaces.map(space => (
        <SpaceCard space={space} key={space.id} />
      ))}
    </Box>
    </>
  )
}

export default SpaceCardList