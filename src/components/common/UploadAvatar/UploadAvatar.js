
import { useState } from "react";

// Mui components
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// Mui Icons
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const UploadAvatar = ({setPhoto}) => {
  const [previewPhoto, setPreviewPhoto] = useState('')
  
  const handleUpladImage = (e) => {
    const file = e.target.files[0]
    setPhoto(file)
    setPreviewPhoto(URL.createObjectURL(file))
  }
  return (
    <Box>
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input
          hidden
          accept="image/png,image/jpeg"
          type="file"
          onChange={e => handleUpladImage(e)}
        />
        <PhotoCamera />
    </IconButton>
    {previewPhoto && <Avatar
      src={previewPhoto}
      sx={{ width: 100, height: 100 }}
    >
      
    </Avatar>
    }
    </Box>
  )
}

export default UploadAvatar