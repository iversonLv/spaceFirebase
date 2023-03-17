import { createContext, useContext, useState, useEffect, useMemo } from 'react'

import { collection, query, where, getDocs } from "firebase/firestore";
import { db, SPACES_COLLECTION } from './firebase-config'

import { checkBucketData } from './firestore'

import { addSpaces } from "./test-data";

const SpacesContext = createContext({
  spaces: [],
  isLoading: true
})


const useFirebaseSpaces = () => {
  const [spaces, setSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSpaces = async(filterKey, queryOperator, filterValue) => {
    // addSpaces(5)
    setIsLoading(true)
    const colSpaces = collection(db, SPACES_COLLECTION)
    const docRef = filterValue ? query(colSpaces, where(filterKey, queryOperator, filterValue)) : colSpaces
    
    // const unscribe = onSnapshot(docRef, async querySnapshot => {
    //   let allSpaces = [] 
    //   for (const docSnapshot of querySnapshot.docs) {
    //     const space = docSnapshot.data()
    //     await allSpaces.push({
    //       ...space,
    //       thumbnail: await checkBucketData(space?.bucket),
    //       author: {
    //         ...space.author,
    //         photoURL: await checkBucketData(space?.author?.bucket)
    //       },
    //       id: docSnapshot.id
    //     })
    //   }
    //   setSpaces(allSpaces)
    //   setIsLoading(false)
    // })
    // return unscribe
    const querySnapshot = await getDocs(docRef)
    let allSpaces = [] 
    for (const docSnapshot of querySnapshot.docs) {
      const space = docSnapshot.data()
      await allSpaces.push({
        ...space,
        thumbnail: await checkBucketData(space?.bucket),
        author: {
          ...space.author,
          photoURL: await checkBucketData(space?.author?.bucket)
        },
        id: docSnapshot.id
      })
    }
    setSpaces(allSpaces)
    setIsLoading(false)
  }

  useEffect(() => {
    const unscribe = async() => {
      await fetchSpaces()
    }
    return () => unscribe()
  }, []);

  const contextValue  = useMemo(() => ({
    spaces
  }), [spaces])
  return {
    fetchSpaces,
    ...contextValue,
    isLoading,
    setIsLoading
  }
}

export const SpacesProvider = ({ children }) => {
  const spaces = useFirebaseSpaces()
  return (
    <SpacesContext.Provider value={spaces}>
      {children}
    </SpacesContext.Provider>
  )
} 

const useSpaces = () => useContext(SpacesContext)
export default useSpaces
