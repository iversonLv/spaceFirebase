import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

// component 
import UserProfile from "../common/UserProfile/UserProfile";

import { getUserSpacesById, getUserById } from '../../firebase/firestore'

const User = ({setLoading}) => {
  const params = useParams();
  const [user, setUser] = useState({})
  
  const [userJoinSpaces, setUserJoinSpaces] = useState([])
  const [userCreateSpaces, setUserCreateSpaces] = useState([])
  const [loadUserJoinSpaces, setLoadUserJoinSpaces] = useState(true)
  const [loadUserCreateSpaces, setLoadUserCreateSpaces] = useState(true)

  useEffect(() => {
    const unscribe = async() => {
      if (params.uid ) {
        await getUserById(params.uid, setUser)
        await getUserSpacesById(params.uid, setUserJoinSpaces, 'join', setLoadUserJoinSpaces)
        await getUserSpacesById(params.uid, setUserCreateSpaces, 'author', setLoadUserCreateSpaces)
      }
    }
    return () => unscribe()
}, [params.uid]);
  return <UserProfile
            user={user}
            userJoinSpaces={userJoinSpaces}
            userCreateSpaces={userCreateSpaces}
            loadUserJoinSpaces={loadUserJoinSpaces}
            loadUserCreateSpaces={loadUserCreateSpaces}
            title ='User profile'
          />
}

export default User