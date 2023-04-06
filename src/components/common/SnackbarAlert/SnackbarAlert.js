import { createPortal } from 'react-dom'
import { memo } from 'react'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const SnackbarAlert = memo(({ open, handleClose, message, severity='success' }) => {
  return (
    createPortal(
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>, document.body)
  )
})

export default SnackbarAlert