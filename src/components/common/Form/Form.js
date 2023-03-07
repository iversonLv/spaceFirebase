import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// MUI component
import { Box } from "@mui/system"
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

// reactJs tagss
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// components
import SelectCountry from '../SelectCountry/SelectCountry'
import UploadAvatar from '../UploadAvatar/UploadAvatar'
import TextForm from '../TextForm/TextForm'
import SnackbarAlert from "../SnackbarAlert/SnackbarAlert";

// helper
import { checkObj } from '../../../utils/helper'

// constants
import { HOME_URL } from "../../../constants";

// context
import useAuth from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase-config";

import { EmailAuthProvider } from 'firebase/auth';


const Form = ({
  title,
  loading,
  setLoading
}) => {
  const { signIn, register } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)
  const [message, setMessage] = useState('');
  
  // user login/register state
  const [emailPasswordField, setEmailPasswordField] = useState({email:'', password:''})
  const [interests, setInterests] = useState([])
  const [otherFields, setOtherFields] = useState({displayName:'', biography:''})
  const [country, setCountry] = useState({value: '', label: ''})
  const [photo, setPhoto] = useState(null)

  // Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: HOME_URL,
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID
  ]
};

  const handleAction = async (action) => {
    // Init show the loading bar
    setLoading(true)
    setMessage('')
    setOpen(false);
    if (action === 'Login') {
      try {
        const { email, password } = emailPasswordField
        await signIn(email, password)
        // After loginning, hide the loading bar
        // After loginning, navigation to home page
        navigate(HOME_URL)
        // After loginning, reset the login form
        setEmailPasswordField({email:'', password:''})
      } catch(error) {
        // Catch error, loading bar disappear
        // If error, show the snackbar
        
        setOpen(true);
        setMessage(error.code);
      }
    }
    if (action === 'Register') {
      try {
        const { biography, displayName } = otherFields
        const { email, password } = emailPasswordField
        const data = {
          biography,
          country,
          interests,
          displayName,
          spaces: [],
        }
        await register(email, password, data, photo)
        navigate(HOME_URL)
        
        // After loginning, navigation to home page
        // After logining, set sessionStoreage
        // After loginning, reset the login form
        setEmailPasswordField({email:'', password:''})
        setOtherFields({displayName:'', biography:''})
        setCountry({value: '', label: ''})
        setInterests([])
        // After loginning, hide the loading bar
      } catch(error) {
        // Catch error, loading bar disappear
        // If error, show the snackbar
        // Specific error show specific message
        setOpen(true);
        setMessage(error.code);
      }
    }
    setLoading(false)
    }

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (e) => e.preventDefault()

  const handleEmailPasswordFieldChangeInput = (e) => setEmailPasswordField({...emailPasswordField, [e.target.name]: e.target.value})
  const handleOtherFields = (e) => setOtherFields({...otherFields, [e.target.name]: e.target.value })
  const handleInterestsChange = (tags) => setInterests([...tags])
  
  // snack bar state 
  const [open, setOpen] = useState(false);

  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (title === 'Register' && (
      checkObj(emailPasswordField) ||
      checkObj(otherFields)||
      checkObj(country) ||
      interests.length === 0)) {
      return setDisabledBtn(true)
    } else {
      setDisabledBtn(false)
    }
    if (title === 'Login' && checkObj(emailPasswordField)) {
      return setDisabledBtn(true)
    } else {
      setDisabledBtn(false)
    }
  }, [emailPasswordField, otherFields, interests, title, country]);

  return (
    <Paper sx={{
      width: '500px',
      p: '24px',
      m: '0 auto'
    }}>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      <Typography
        variant="h4"
        gutterBottom
        align='center'
        sx={{
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Typography>
      <Box
        component="form"
        autoComplete="off"
      >
          <TextForm
            name='email'
            required={true}
            handleChange={handleEmailPasswordFieldChangeInput}
          />
          <TextForm
            name='password'
            type={showPassword ? 'text' : 'password'}
            required={true}
            handleChange={handleEmailPasswordFieldChangeInput}
            props={{
                endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={(e) => handleMouseDownPassword(e)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>,
              }}
          />
          {title === 'Register' && (
            <>
            
              <TextForm
                value={otherFields.displayName}
                name='displayName'
                required={true}
                handleChange={handleOtherFields}
              />
              <TextForm
                value={otherFields.biography}
                name='biography'
                required={true}
                handleChange={handleOtherFields}
              />
              <SelectCountry setCountry={setCountry} country={country}/>
              <TagsInput value={interests} onChange={handleInterestsChange} inputProps={{placeholder: "Add interests", className: 'react-tagsinput-input'}} />
              <UploadAvatar setPhoto={setPhoto}/>
            </>
          )}
        <Button variant="contained" onClick={() => handleAction(title)} disabled={loading || disabledBtn}>{title}</Button>
      </Box>
      
      <SnackbarAlert open={open} handleClose={handleClose} message={message} severity='warning'/>
    </Paper>
  )
}

export default Form