// Constants
import { HOME_URL } from "../../constants";
import { useNavigate } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { EmailAuthProvider } from 'firebase/auth';

import {
  onAuthStateChanged
} from 'firebase/auth'
// context
import { auth } from "../../firebase/firebase-config";

// context
import useAuth from '../../firebase/auth'

const Signinup = () => {
  const navigate = useNavigate()
  const { authStateChanged } = useAuth()
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    callbacks: {
      signInSuccessWithAuthResult: () => {
        // Here we need detect the state of authUser or not
        // Or navigate home page, header won't change
        onAuthStateChanged(auth, authStateChanged)
        navigate(HOME_URL)
        
      }
    },
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID
    ]
  };
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
  )
}

export default Signinup