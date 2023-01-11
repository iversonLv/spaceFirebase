import {useNavigate } from 'react-router-dom'

// MUI component
import { Box } from "@mui/system"

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'


const loginedNavItem = [
  {'label': 'Home', 'route': '/home'}, 
  {'label': 'Profile', 'route': '/profile'}, 
  {'label': 'Create Learning Space', 'route': '/createLearningSpace'}, 
];
const nonLoginedNavItem = [
  {'label': 'Login', 'route': '/login'}, 
  {'label': 'Register', 'route': '/register'}, 
];

const Header = () => {
  const authToken = sessionStorage.getItem('Auth Token')
  const navigate = useNavigate()
  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    navigate('/login')
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
            TOPCODER SKILL REACTJS BUILDER
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {authToken && (<>
            {loginedNavItem.map(item => (
              <Button key={item.route} sx={{ color: '#fff' }} onClick={() => navigate(item.route)}>
                {item.label}
              </Button>
            ))}
            <Button sx={{ color: '#fff' }} onClick={handleLogout}>
              Logout
            </Button>
            </>)}
            {/* If not logined, show login and register button */}
            {!authToken && 
              nonLoginedNavItem.map(item => (
                <Button key={item.route} sx={{ color: '#fff' }} onClick={() => navigate(item.route)}>
                  {item.label}
                </Button>
              ))
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header