import { memo } from 'react'

// MUI components
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

const DividerWithTitle = memo(({title}) => {
  return (
    <Divider
      sx={{
        m: '10px 0'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'light'
        }}
      >
        {title}
      </Typography>
    </Divider>
  )
})

export default DividerWithTitle