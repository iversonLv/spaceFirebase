import { useState } from "react";

// Mui components
import { Box, Drawer, IconButton } from "@mui/material"

// Mui icons
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

// Components
import Menu from "./Menu";

const HeaderMenu = () => {
// State
// mobile menu
const [showMenu, setShowMenu] = useState(false);
// For accessibility
const toggleDrawer = (open) => (event) => {
  if (
    event.type === 'keydown' &&
    (event.key === 'Tab' || event.key === 'Shift')
  ) {
    return;
  }
  setShowMenu(open);
};

return (
  <Box
    sx={{
      display: { xs: 'block', sm: 'none' }
    }}
  >
    <IconButton onClick={toggleDrawer(true)} sx={{ color: '#fff' }}>
      <MenuOutlinedIcon />
    </IconButton>
    <Drawer anchor={'top'} open={showMenu} onClose={toggleDrawer(false)}>
      <Menu toggleDrawer={toggleDrawer}/>
    </Drawer>
  </Box>
)
}

export default HeaderMenu