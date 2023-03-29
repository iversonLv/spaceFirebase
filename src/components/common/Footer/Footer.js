import { Button, Divider, IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { MY_GITHUB_URL, PROJECT_GITHUB_URL } from "../../../constants"

import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <footer>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '40px'
        }}
      >
        <Box>
          <Typography variant="body" component="p">
            By 
            <Button
              target="_blank"
              component='a'
              href={MY_GITHUB_URL}>iversonLv</Button> on 2023
          </Typography>
        </Box>
        <Box>
          <IconButton
            target="_blank"
            component='a'
            href={PROJECT_GITHUB_URL}
            size="small" color="primary" aria-label="add to shopping cart">
            <GitHubIcon />
          </IconButton>
        </Box>
      </Box>
    </footer>
  )
}

export default Footer