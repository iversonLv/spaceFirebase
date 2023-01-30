import { createContext, useContext, useState, useEffect } from "react";

import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { auth, db, USERS_COLLECTION } from './firebase-config'
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { uploadImage } from './storage'
import { checkBucketData } from './firestore'

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true
})

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const clear = () => {
    setAuthUser(null)
    setIsLoading(false)
  }

  const authStateChanged = async(user) => {
    setIsLoading(true)
    if (!user) {
      clear()
      return
    }
    
    // if user however
    const docRef = await doc(db, USERS_COLLECTION, user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      // const bucket = docSnap.data()?.bucket
      // getDownloadStorageURL(bucket).then(photoURL => {
        //   setAuthUser({...docSnap.data(), photoURL})
        // })
      setAuthUser({...docSnap.data(), photoURL: await checkBucketData(docSnap.data()?.bucket)})
    } else {
      // If we use firebaseUi register, we need check user, and set such user doc to
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        createdOn: serverTimestamp(),
        bucket: ''
      }
      // doc.data() will be undefined in this case
      await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);
      setAuthUser({...userData})
    }
    setIsLoading(false)

  }

  const logout = () => signOut(auth).then(() => clear())

  const signIn = async(email, password) => await signInWithEmailAndPassword(auth, email, password)
  
  const register = async(email, password, data, photo) => {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      // if register user, we don't upload avatar for user, 
      // bucket should be '' then user won't run uploadImage() or it will throw error
      
      setIsLoading(true)
      const bucket = photo ? await uploadImage(photo, res.user.uid) : ''
      // const bucket =  ''
      await setDoc(doc(db, USERS_COLLECTION, res.user.uid), {
        ...data,
        bucket,
        uid: res.user.uid
      });
      await updateProfile(res.user, {
        displayName: data.displayName,
        photoURL: bucket
      });
      setIsLoading(false)
  }

  useEffect(() => {
    const unscribe = onAuthStateChanged(auth, authStateChanged)
    // TODO: now after register with upload image, there is race condition that page load home page however not check the authUser
    // onAuthStateChanged(auth, authStateChanged)
    // setTimeout(() => {
    // }, 0);
    return unscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    authUser, 
    isLoading,
    logout,
    signIn,
    setIsLoading,
    register
  }
}

export const AuthUserProvider = ({ children }) => {
  const auth = useFirebaseAuth()
  return (
    <AuthUserContext.Provider value={auth}>
      {children}
    </AuthUserContext.Provider>
  )
}

const useAuth = () => useContext(AuthUserContext);
export default useAuth
