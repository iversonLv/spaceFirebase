import {useNavigate } from 'react-router-dom'

// constants
import  { LOGIN_URL, REGISTER_URL, HOME_URL, PROFILE_URL, APP_HEADING, SPACES_URL } from '../../../constants'

// MUI component
import { Box } from "@mui/system"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'

// MUI icons
import LogoutIcon from '@mui/icons-material/Logout';

// context
import useAuth from '../../../firebase/auth'

// component
import NavBtn from '../NavBtn/NavBtn'
import CommonAvatar from '../CommonAvatar/CommonAvatar'


const loginedNavItem = [
  {'label': 'Home', 'route': HOME_URL}, 
  {'label': 'Profile', 'route': PROFILE_URL}, 
  {'label': 'Create Learning Space', 'route': `${SPACES_URL}/create`}, 
];
const nonLoginedNavItem = [
  {'label': 'Home', 'route': HOME_URL}, 
  {'label': 'Login', 'route': LOGIN_URL}, 
  {'label': 'Register', 'route': REGISTER_URL}, 
];

const Header = () => {
  const { logout, authUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate(LOGIN_URL)
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {APP_HEADING}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {!!authUser && !isLoading && (<>
            {loginedNavItem.map(item => (
              <NavBtn {...item} key={item.route}/>
            ))}
            <Tooltip title='Logout' placement="bottom">
              <IconButton  sx={{ color: '#fff' }} onClick={handleLogout}>
                <LogoutIcon/>
              </IconButton >
            </Tooltip>
            </>)}
            {/* If not logined, show login and register button */}
            {!authUser && !isLoading && 
              nonLoginedNavItem.map(item => (
                <NavBtn {...item}  key={item.route}/>
              ))
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header