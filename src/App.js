import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from './firebase-config'
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged} from 'firebase/auth'
import './App.css';

// MUI component
import { Box } from "@mui/system"
import Toolbar from '@mui/material/Toolbar'
import LinearProgress from '@mui/material/LinearProgress'

// components
import Form from './components/common/Form/Form'
import Header from './components/common/Header/Header'
import SnackbarAlert from './components/common/SnackbarAlert/SnackbarAlert'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import NotFound from './components/NotFound/NotFound'
import CreateLearningSpace from './components/CreateLearningSpace/CreateLearningSpace'

const App = () => {
  const navigate = useNavigate()

  // loading state
  const [loading, setLoading] = useState(false);

  // profile state
  const [me, setMe] = useState({})

  // snack bar state 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // user login/register state
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [biography, setBiography] = useState('')
  const [interests, setInterests] = useState([])
  
  useEffect(() => {
    const authToken = sessionStorage.getItem('Auth Token')
    if (authToken) {
      navigate('/home')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMe({...docSnap.data(), displayName: user.displayName})
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    });
  }, [auth, setMe])

  const handleAction = async (action) => {
    const authentication = getAuth()
    // Init show the loading bar
    setLoading(true)
    setMessage('')
    setOpen(false);
    if (action === 'login') {
      signInWithEmailAndPassword(authentication, email, password)
        .then((res) => {
          
          // After loginning, hide the loading bar
          setLoading(false)
          // After loginning, navigation to home page
          navigate('/home')
          // After logining, set sessionStoreage
          sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken)
          // After loginning, reset the login form
          setEmail('')
          setPassword('')
        }).catch((error) => {
          // Catch error, loading bar disappear
          setLoading(false)
          // If error, show the snackbar
          
          setOpen(true);
          setMessage(error.code);
        })
    }
    if (action === 'register') {
      try {

        const res = await createUserWithEmailAndPassword(authentication, email, password)
        await setDoc(doc(db, "users", res.user.uid), {
          biography,
          country,
          interests
        });
        await updateProfile(res.user, {
          displayName,
        });
  
        // After loginning, hide the loading bar
        setLoading(false)
        sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken)
        // After loginning, navigation to home page
        navigate('/home')
        // After logining, set sessionStoreage
        // After loginning, reset the login form
        setEmail('')
        setPassword('')
        setCountry('')
        setBiography('')
        setDisplayName('')
        setInterests([])
      } catch(error) {
        // Catch error, loading bar disappear
        setLoading(false)
        // If error, show the snackbar
        // Specific error show specific message
        setOpen(true);
        setMessage(error.code);
      }
    }
  }
  return (
      <div className='App'>
        <>
          <Header />
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar />
            {loading && (<Box sx={{ width: '100%' }}>
              <LinearProgress color="secondary"/>
            </Box>)
            }
            <Routes>
              <Route
                path="/login"
                element={
                  <Form
                    title="Login"
                    loading={loading}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleAction={() => handleAction("login")}
                  />
                }/>
              <Route
                path="/Register"
                element={
                  <Form
                    title="Register"
                    loading={loading}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setCountry={setCountry}
                    setBiography={setBiography}
                    setDisplayName={setDisplayName}
                    interests={interests}
                    setInterests={setInterests}
                    handleAction={() => handleAction("register")}
                  />
                }/>
              <Route
                path="/home"
                element={
                  <Home me={me}/>
                }
              />
              <Route
                path="/createLearningSpace"
                element={
                  <CreateLearningSpace />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile me={me} setMe={setMe} />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <SnackbarAlert open={open} handleClose={handleClose} message={message}/>
        </>
      </div>
  );
}

export default App;
