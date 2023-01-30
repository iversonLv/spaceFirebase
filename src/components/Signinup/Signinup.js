
// Constants
import { HOME_URL } from "../../constants";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { EmailAuthProvider } from 'firebase/auth';

// context
import { auth } from "../../firebase/firebase-config";

const Signinup = () => {
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
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
  )
}

export default Signinup