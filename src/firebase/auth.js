import { createContext, useContext, useState, useEffect } from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth'
import { auth, db, USERS_COLLECTION } from './firebase-config'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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
  
  const updateUserInfo = async(data, thumbnail, uid, setLoading) => {
    setLoading(true)
    const userRef = doc(db, USERS_COLLECTION, uid)
    await updateDoc(userRef, {
      ...data,
      bucket: thumbnail ? await uploadImage(thumbnail, uid) : '',
    })

    // after update, will refetch the user
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      // const bucket = docSnap.data()?.bucket
      // getDownloadStorageURL(bucket).then(photoURL => {
        //   setAuthUser({...docSnap.data(), photoURL})
        // })
      await setAuthUser({...docSnap.data(), photoURL: await checkBucketData(docSnap.data()?.bucket)})
      setLoading(false)
    }
  }

  // send email to reset password
  const forgotPassword = async (setLoading, setMessage) => {
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email)
      setLoading(false)
      setMessage('The reset password link has been sent to your registered email, kindly check the inbox')
    } catch(error) {
      setLoading(false)
      if(error) setMessage(error.message)
    }
  }

  // reset password in app
  // first need to re-authenticate with existing password
  const reAuthWithPassword= async(currentPassword, setLoading, setMessage, setInvalid) => {
    setLoading(true)
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    )
    try {
      console.log(1)
      // TODO: there is a bug for this Promise, can't not catch the error
      const result  =  await reauthenticateWithCredential(auth.currentUser, credential)
      console.log(result)
      setMessage('')
      setLoading(false)
      setInvalid(false)
      console.log(3)
    } catch(error) {
      setLoading(false)
      
      setMessage(error.message)
      setInvalid(true)
        
      console.log(4)
    }
  }
  // This function is relied on reAuthWithPassword()
  // Because when we update user password, we need to re auth the current user first
  const updateUserPassword = async(newPassword, setLoading, setMessage, setInvalid) => {
    setLoading(true)
    try {
      await updatePassword(auth.currentUser, newPassword)
      setMessage('Your password has been updated!')
      setLoading(false)
      setInvalid(false)
    } catch(error) {
      setLoading(false)
      setMessage(error.message)
      setInvalid(true)
    }
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
    register,
    updateUserInfo,
    forgotPassword,
    reAuthWithPassword,
    updateUserPassword
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
