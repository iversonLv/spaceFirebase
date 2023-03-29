import { useState, useEffect } from "react"

// Mui components
import { Box, Button, Grid, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
// Mui icons

// reactJs tagss
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import SelectCountry from "../common/SelectCountry/SelectCountry"
import TextForm from "../common/TextForm/TextForm"
import useAuth from "../../firebase/auth";
import SnackbarAlert from "../common/SnackbarAlert/SnackbarAlert";
import DndUpload from "../common/DndUpload/DndUpload";
import DividerWithTitle from "../common/DividerWithTitle/DividerWithTitle";
import BackArrowTitleWithActionBtn from "../common/BackArrowTitleWithActionBtn/BackArrowTitleWithActionBtn";

const ProfileEdit = ({loading, setLoading}) => {
  const { authUser, updateUserInfo, forgotPassword, reAuthWithPassword, updateUserPassword } = useAuth()
  const { biography, uid, country: userCountry, interests: userInsterests, photoURL } = authUser
  
  const [interests, setInterests] = useState(userInsterests ?? [])

  const [otherFields, setOtherFields] = useState({biography})
  const [country, setCountry] = useState(userCountry)
  const [disabledBtn, setDisabledBtn] = useState(false)
  
  const [thumbnail, setThumbnail] = useState()
  const [previewPhoto, setPreviewPhoto] = useState(photoURL)
  // useEffect(() => {
  //  if (
  //   checkObj(otherFields)||
  //   checkObj(country) ||
  //   interests?.length === 0) {
  //     return setDisabledBtn(true)
  // }
  // return setDisabledBtn(false)
  // }, [country, interests?.length, otherFields]);

  useEffect(() => {
    const { biography } = otherFields
    const userData = {
      biography: authUser.biography,
      country: authUser.country,
      interests: authUser.interests ?? [],
      previewPhoto: authUser.photoURL
    }
    const data = {
      biography,
      country,
      interests,
      previewPhoto
    }
    if (
      JSON.stringify(userData) !== JSON.stringify(data)
    ) {
      setDisabledBtn(false)
    } else {
      setDisabledBtn(true)
    }
    
  }, [authUser.biography, authUser.country, authUser.interests, authUser.photoURL, country, interests, otherFields, previewPhoto])
  
  const handleInterestsChange = (tags) => setInterests([...tags])
  const handleOtherFields = (e) => setOtherFields({...otherFields, [e.target.name]: e.target.value })
  const handleAction = async () => {
    setMessage('')
    setOpen(false);
    const { biography } = otherFields
    const data = {
      biography,
      country,
      interests,
    }
    await updateUserInfo(data, thumbnail, uid, setLoading)
    setOpen(true);
    setMessage('Update the profile succeed!')
  }

  const handleDeletePhoto = () => {
    setThumbnail(null)
    setPreviewPhoto(null)
  }

  // snack bar state 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [invalid, setInvalid] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [labelProps, setLabelProps] = useState({});

  const handleUpdatePasswordField = (e) => {
    setPasswords({...passwords, [e.target.name]: e.target.value})
  }
  
  const handleReAuthWithPassword = async () => {
    setMessage('')
    setOpen(false)
    await reAuthWithPassword(passwords?.currentPassword, setLoading, setMessage, setInvalid)
    if (invalid) {
      setOpen(true)
      return
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }
  const handleUpdatePassword = async() => {
    const {currentPassword, newPassword, confirmNewPassword} = passwords
    console.log(passwords)
    setLabelProps({})
    setMessage('')
    setOpen(false)
    if (newPassword !== confirmNewPassword) {
      setLabelProps({
        optional:<Typography variant="caption" color="error">
                Please ensure the new password equals to the confirm password
              </Typography>,
        error: true
      })
      return
    }
    if (currentPassword === newPassword) {
      setLabelProps({
        optional:<Typography variant="caption" color="error">
                Please try not use the same password with the current password
              </Typography>,
        error: true
      })
      return
    }
    await updateUserPassword(newPassword, setLoading, setMessage, setInvalid)
    setOpen(true)
    if (invalid) return
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }
  
  // forgot password
  const handleForgotPassword = async() => {
    setMessage('')
    setOpen(false)
    await forgotPassword(setLoading, setMessage)
    setOpen(true)
  }
  
  return(
    <>
      <BackArrowTitleWithActionBtn title='Edit Profile' />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} lg={4}>
          {/* avatar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            <DndUpload
              shape='circular'
              setThumbnail={setThumbnail}
              previewPhoto={previewPhoto}
              setPreviewPhoto={setPreviewPhoto}
              disabled={loading}
            />
            <Button
              variant="text"
              size='small'
              color="warning"
              onClick={handleDeletePhoto}
              disabled={previewPhoto === null}
            >
              Delete photo
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} lg={8}>
          {/* info */}
          <TextForm
            value={otherFields.biography || ''}
            name='biography'
            handleChange={handleOtherFields}
          />
          <SelectCountry setCountry={setCountry} country={country}/>
          <TagsInput value={interests} onChange={handleInterestsChange} inputProps={{placeholder: "Add interests", className: 'react-tagsinput-input'}} />
          <Button
            variant="contained"
            size='small'
            onClick={handleAction}
            disabled={loading || disabledBtn}
          >
            Update
          </Button>
          {/* reset password */}
          <DividerWithTitle title='Update Password'/>








          {/* update password */}
          <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel
                >
                  First you need to enter the current password
                </StepLabel>
                <StepContent>
                  <>
                    <Typography
                      variant="body2" 
                      gutterBottom
                    >
                      Please firstly enter your current password in order that 
                    </Typography>
                    <TextForm
                      required={true}
                      value={passwords?.currentPassword || ''}
                      name='currentPassword'
                      handleChange={handleUpdatePasswordField}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        size='small'
                        sx={{ mt: 1, mr: 1 }}
                        disabled={loading || passwords?.currentPassword === ''}
                        onClick={handleReAuthWithPassword}>
                        Continue
                      </Button>
                    </Box>
                  </>
                </StepContent>
              </Step>
              <Step>
                <StepLabel
                  {...labelProps}
                >
                  Now you could enter the new password
                </StepLabel>
                <StepContent>
                  <>
                    <TextForm
                      required={true}
                      value={passwords?.newPassword || ''}
                      name='newPassword'
                      handleChange={handleUpdatePasswordField}
                    />
                    <TextForm
                      required={true}
                      value={passwords?.confirmNewPassword || ''}
                      name='confirmNewPassword'
                      handleChange={handleUpdatePasswordField}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Button
                        size='small'
                        variant="outlined"
                        sx={{ mt: 1, mr: 1 }}
                        disabled={
                          loading ||
                          passwords?.newPassword === '' ||
                          passwords?.confirmNewPassword === '' 
                        }
                        onClick={handleUpdatePassword}>
                        Update password
                      </Button>
                    </Box>
                  </>
                </StepContent>
              </Step>
            </Stepper>
            {activeStep === 2 && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>You have updated your password</Typography>
                <Typography
                  variant='caption'
                  sx={{
                    fontStyle: 'italic'
                  }}
                >
                  You could update new password 24h later
                </Typography>
              </Paper>
            )}
          </Box>









          <DividerWithTitle title='Forgot Password'/>
          <Typography
              variant="body2" 
              gutterBottom
            >
            Forgot the password?
            Never mind, click below button.
            We will send you a reset password link to your register email.
          </Typography>
          <Button
            variant='outlined'
            size='small'
            onClick={handleForgotPassword}
          >
            Forgot password
          </Button>
        </Grid>
      </Grid>
      {open && <SnackbarAlert open={open} handleClose={handleClose} message={message} severity='success'/>}
    </>
  )
}

export default ProfileEdit