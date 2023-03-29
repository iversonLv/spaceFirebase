import { NavLink } from 'react-router-dom'

// MUI component
import Button from '@mui/material/Button'

const NavBtn = ({route, label}) => {
  return (
    <Button
      component={NavLink}
      to={route}
      sx={{
        color: '#fff',
        border: '1px solid transparent',
        '&.active': {
          borderColor: 'white'
        }
      }}>
      {label}
    </Button>
  )
}

export default NavBtn