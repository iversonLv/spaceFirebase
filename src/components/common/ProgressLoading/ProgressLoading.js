import { createPortal } from "react-dom"

// MUI component
import { LinearProgress } from "@mui/material"

const ProgressLoading = () => {
  return (
    createPortal(<LinearProgress color="secondary" sx={{zIndex: 1101, top: 0, position: 'fixed', width: '100%'}}/>, document.body)
  )
}

export default ProgressLoading