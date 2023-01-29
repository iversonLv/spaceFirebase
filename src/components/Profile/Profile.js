import { useState, useEffect } from "react";

// component 
import UserProfile from "../common/UserProfile/UserProfile";

// context
import useAuth from '../../firebase/auth'
import { getUserSpacesById } from '../../firebase/firestore'

const Profile = () => {
  const { authUser } = useAuth()

  const [userJoinSpaces, setUserJoinSpaces] = useState([])
  const [userCreateSpaces, setUserCreateSpaces] = useState([])
  const [loadUserJoinSpaces, setLoadUserJoinSpaces] = useState(true)
  const [loadUserCreateSpaces, setLoadUserCreateSpaces] = useState(true)
  useEffect(() => {
      const unscribe = async() => {
        if (authUser.uid) {
          await getUserSpacesById(authUser.uid, setUserJoinSpaces, 'join', setLoadUserJoinSpaces)
          await getUserSpacesById(authUser.uid, setUserCreateSpaces, 'author', setLoadUserCreateSpaces)
        }
      }
      return () => unscribe()
  }, [authUser.uid]);

  return <UserProfile
            user={authUser}
            userJoinSpaces={userJoinSpaces}
            userCreateSpaces={userCreateSpaces}
            loadUserJoinSpaces={loadUserJoinSpaces}
            loadUserCreateSpaces={loadUserCreateSpaces}
            title ='My profile'
          />
}

export default Profile