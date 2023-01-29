import {useNavigate, NavLink } from 'react-router-dom'

// MUI component
import Button from '@mui/material/Button'

const NavBtn = ({route, label}) => {
  const navigate = useNavigate()
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
      }}
      onClick={() => navigate(route)}>
      {label}
    </Button>
  )
}

export default NavBtn