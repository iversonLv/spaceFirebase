import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const SnackbarAlert = ({ open, handleClose, message, severity='success' }) => {
  return (
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
    </Snackbar>
  )
}

export default SnackbarAlert