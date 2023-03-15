import { Box, Typography } from "@mui/material";
import { useState, useRef, memo } from "react";

import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import './DndUpload.css'
const DndUpload = memo(({setThumbnail, previewPhoto, setPreviewPhoto, disabled, shape='retangle'}) => {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  
  // ref
  const inputRef = useRef(null);
  const handleFiles = (files) =>  {
    setThumbnail(files[0])
    setPreviewPhoto(URL.createObjectURL(files[0]));
  }
  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  
  return (
    <Box
        className={shape === 'circular' ? 'curcular-shape' : ''}
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          accept="image/png, image/jpeg"
          multiple={true}
          onChange={handleChange}
          disabled={disabled}
        />
        <label
          style={{
            backgroundImage: `url(${previewPhoto})`
          }}
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={disabled ? "disabled-upload" : ""}
        >
          <Box
            component='div'
            className="text-area">
            {shape === 'circular'
            ? <PhotoCameraOutlinedIcon /> 
            : <Typography
                variant="body2"
                gutterBottom
                align='center'
              >
                Drag and drop your file here or click to upload a file
              </Typography>
            }
          </Box>
        </label>
        {dragActive && !disabled && (
          <Box
            component='div'
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}
      </Box>
  )
})

export default DndUpload