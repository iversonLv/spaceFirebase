import {useNavigate } from 'react-router-dom'

// constants
import  {
  SIGN_IN_UP_URL,
  HOME_URL,
  APP_HEADING,
  loginedNavItem,
  nonLoginedNavItem
} from '../../../constants'

// MUI component
import {
  Tooltip,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material'

// MUI icons
import LogoutIcon from '@mui/icons-material/Logout';

// context
import useAuth from '../../../firebase/auth'

// component
import NavBtn from '../NavBtn/NavBtn'
import CommonAvatar from '../CommonAvatar/CommonAvatar'
import HeaderMenu from '../HeaderMenu/HeaderMenu';

const Header = () => {
  // Context
  const { logout, authUser, isLoading } = useAuth()
  // Hook
  const navigate = useNavigate()

  // Event function
  const handleLogout = () => {
    logout()
    navigate(SIGN_IN_UP_URL)
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1}}
          >
            {APP_HEADING}
          </Typography>
          <Box sx={{ gap: '15px', display: { xs: 'none', sm: 'flex' } }}>
            <NavBtn route={HOME_URL} label='Home'/>
            {!!authUser && !isLoading && (<>
            {loginedNavItem.map(item => (
              <NavBtn {...item} key={item.route}/>
            ))}
              <CommonAvatar user={authUser} tooltipPlacement="bottom" me={true}/>
              <Tooltip title='Logout' placement="bottom">
                <IconButton  sx={{ color: '#fff' }} onClick={handleLogout}>
                  <LogoutIcon/>
                </IconButton >
              </Tooltip>
            </>
            )}
            {/* If not logined, show login and register button */}
            {!authUser && !isLoading && 
              nonLoginedNavItem.map(item => (
                <NavBtn {...item}  key={item.route}/>
              ))
            }
          </Box>
          {/* Mobile menu */}
          <HeaderMenu />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header