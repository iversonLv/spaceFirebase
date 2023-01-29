// MUI components
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

const DividerWithTitle = ({title}) => {
  return (
    <Divider
      sx={{
        margin: '10px 0'
      }}
    >
      <Typography
        variant="h6"
      >
        {title}
      </Typography>
    </Divider>
  )
}

export default DividerWithTitle