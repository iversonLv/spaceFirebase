import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { APP_HEADING, HOME_URL, loginedNavItem, nonLoginedNavItem, SIGN_IN_UP_URL } from "../../../constants";

// Mui icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import useAuth from "../../../firebase/auth";

const Menu = ({toggleDrawer}) => {
  // Context
  const { logout, authUser, isLoading } = useAuth()
  // Hook
  const location = useLocation()
  const navigate = useNavigate()

  // Event function
  const handleLogout = () => {
    logout()
    navigate(SIGN_IN_UP_URL)
  }

  return (
  <Box
    role="menu"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: '8px 16px'
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1}}
      >
        {APP_HEADING}
      </Typography>
      <IconButton onClick={toggleDrawer(false)}>
        <CloseOutlinedIcon/>
      </IconButton>
    </Box>
    <Divider />
    <List>
      <ListItem disablePadding>
        <ListItemButton component={NavLink} to={HOME_URL} selected={HOME_URL === location.pathname}>
          <ListItemText primary='Home' />
        </ListItemButton>
      </ListItem>
      
      {!!authUser && !isLoading && loginedNavItem.map(item => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton component={NavLink} to={item.route} selected={item.route === location.pathname}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
      
    </List>
    <Divider />
    <List>
      {/* If not logined, show login and register button */}
      {!authUser && !isLoading && nonLoginedNavItem.map((item) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton component={NavLink} to={item.route} selected={item.route === location.pathname}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
      {!!authUser && !isLoading && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  </Box>
  )
}

export default Menu