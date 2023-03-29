import { memo } from 'react'
import { useNavigate } from 'react-router-dom';

// Mui components
import { Box,  IconButton, Typography } from '@mui/material'
// Mui icons
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const BackArrowTitleWithActionBtn = memo(({title, children}) => {
  // hook
  const navigate = useNavigate();

  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          textTransform: 'uppercase'
        }}
      >
        <IconButton color="primary" aria-label="back" variant="outlined" onClick={() => navigate(-1)}>
          <ArrowBackIosNewOutlinedIcon/>
        </IconButton>
        {title}
      </Typography>
      {children}
    </Box>
  )
})

export default BackArrowTitleWithActionBtn