import { db, USERS_COLLECTION, SPACES_COLLECTION, POSTS_COLLECTION, COMMENTS_COLLECTION, auth } from './firebase-config'
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  getCountFromServer,
  writeBatch,
  deleteDoc
} from "firebase/firestore";
import { delStorageImage, getDownloadStorageURL, uploadImage } from './storage'
import { DisLike_T, Like_T, TYPE_COMMENT, TYPE_POST } from '../constants';

export const checkBucketData = async (bucketData) => {
  return !!bucketData ? await getDownloadStorageURL(bucketData) : null
}
/**
 * @param  {Obj} authUser: current login user
 * @param  {Obj} post: input post data
 * @param  {Obj} spaceId: the post is belong to the space
 */
export const addPost = async (authUser, post, spaceId, setLoading ) => {
  setLoading(true)
  const docSpaceRef = await doc(db, SPACES_COLLECTION, spaceId)
  const colPost = collection(db, POSTS_COLLECTION)
  const docAuthUserRef = doc(db, USERS_COLLECTION, authUser.uid)

  const {uid, bucket, displayName} = authUser
  const {title, content} = post
  const postDoc = await addDoc(colPost, {
    author: {uid, bucket, displayName},
    content,
    title,
    spaceId,
    // Firebase default timestamp generate method
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  });
  
  // After new post created, the related space need push the postId as related
  await updateDoc(docSpaceRef, {
    // Firebase default method, push item to array
    postsId: arrayUnion(postDoc.id)
  });
  // After new post created, the related author need push the postId as related
  await updateDoc(docAuthUserRef, {
    postsId: arrayUnion(postDoc.id)
  })
  setLoading(false)
}


export const deletePostComment = async (type, id, uid, spaceId, parentId, postId) => {
  if (id) {
    const batch = writeBatch(db)
    const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
    
    const docAuthUserRef = doc(db, USERS_COLLECTION, uid)
    const docSpaceRef = doc(db, SPACES_COLLECTION, spaceId)
    // delete the post or comment of the id
    batch.delete(docRef)
    // remove the id from the space postId array
    batch.update(docSpaceRef, {
      postsId: arrayRemove(id)
    })

    // need to remove the deleted post's or comment's comments
    // if delete post, this parentId point to comment's comment, not work
    await deleteCommentsRecursion(id, docAuthUserRef)  
    
    if (type === TYPE_COMMENT) {

      const parentDoc = parentId === postId ? doc(db, POSTS_COLLECTION, parentId) : doc(db, COMMENTS_COLLECTION, parentId)
      //const parentCommentDoc = doc(db, COMMENTS_COLLECTION, parentId)
  
      // need remove the id from postId commentsId array
      batch.update(parentDoc, {
        commentsId: arrayRemove(id)
      })
    }
    // batch.update(parentCommentDoc, {
    //   commentsId: arrayRemove(id)
    // })
      // need to remove this comment's id from posts commentsId
      // need to remove this comment's id from parent comment's commentsId
      
      
      
      
    // After remove, the related author need delete the id 
    batch.update(docAuthUserRef, {
      [type+'sId']: arrayRemove(id)
    })
    await batch.commit();
    
  }
}

export const getPosts = async (spaceId, setPosts, setLoading) => {
  setLoading(true)
  if (spaceId) {
    const q = query(collection(db, POSTS_COLLECTION), where('spaceId', "==", spaceId), orderBy('createdOn', 'desc'));
    // automatically update after the doc update
    const unscribe = await onSnapshot(q, async snapShot => {
      let allPosts = []
      for (const docSnapShot of snapShot.docs) {
        const post = docSnapShot.data()
        allPosts.push({
          ...post,
          id: docSnapShot.id,
          author: {
            ...post.author,
            photoURL: await checkBucketData(post.author.bucket)
          }
        })
      }
      setPosts(allPosts)
      setLoading(false)
    })
    return unscribe
  }
}

// get user space join leave state
/**
 * @param  {string} type: 'post' | 'comment'
 * @param  {string} id: if type is post, it's postId, else commentId
 * @param  {string} uid: authUser uid
 * @param  {Fun} setLikeDislike
 */
export const getUserLikeDislikeState = async (type, id, uid, setLikeDislike) => {
  if (id) {
    const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
    const snapshot = await getDoc(docRef);
      if (snapshot.exists) {
        snapshot.data()?.likeByUid?.indexOf(uid) > -1
        ? setLikeDislike(Like_T) 
        : snapshot.data()?.dislikeByUid?.indexOf(uid) > -1
          ? setLikeDislike(DisLike_T) 
          : setLikeDislike('') 
      } else {
        console.log('Ops')
      }
    
  }
}
export const addLikeDislike = async(type, value, id, uid) => {
  const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
  if (value === Like_T) {
    await updateDoc(docRef, {
      likeByUid: arrayUnion(uid),
      dislikeByUid: arrayRemove(uid)
    })
  } else if (value === DisLike_T) {
    await updateDoc(docRef, {
      likeByUid: arrayRemove(uid),
      dislikeByUid: arrayUnion(uid)
    })
  } else {
    await updateDoc(docRef, {
      likeByUid: arrayRemove(uid),
      dislikeByUid: arrayRemove(uid)
    })
  }
}

export const getLikeCounts = async(type, id, setLikeCount) => {
  if (id) {
    const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // if register user, we don't upload avatar for user, bucket should be null then user potoURL should be null rather than get download the URL or it will throw error
      const count = docSnap.data()?.likeByUid?.length === 0 ? '' : docSnap.data()?.likeByUid?.length
      setLikeCount(count)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
}

export const getCommentsCounts = async (type, id, setCommentsCount) => {
  if (id) {
    const colComment = collection(db, COMMENTS_COLLECTION)
    const q = type === TYPE_POST ? query(colComment, where('postId', '==', id)) : query(colComment, where('commentId', '==', id))
    const snapshot  = await getCountFromServer(q)
    setCommentsCount(snapshot.data().count)
  }
}

export const getComments = async (type, id, setComments) => {
  if (id) {
    const colComment = collection(db, COMMENTS_COLLECTION)
    const q = type === TYPE_POST ? query(colComment, where('postId', '==', id), orderBy('createdOn', 'desc')) : query(colComment, where('commentId', '==', id), orderBy('createdOn', 'desc'))

    // const snapShot = await getDocs(q)
    // let allComments = []
    // for (const docSnapShot of snapShot.docs) {
    //   const comment = docSnapShot.data()
    //   allComments.push({
    //     ...comment,
    //     id: docSnapShot.id,
    //     author: {
    //       ...comment.author,
    //       photoURL: await checkBucketData(comment.author.bucket)
    //     }
    //   })
    // }
    // setComments(allComments)

    
    const unscribe = onSnapshot(q, async querySnapshot => {
      let allComments = [] 
      for (const docSnapShot of querySnapshot.docs) {
          const comment = docSnapShot.data()
          allComments.push({
            ...comment,
            id: docSnapShot.id,
            author: {
              ...comment.author,
              photoURL: await checkBucketData(comment.author.bucket)
            }
          })
        }
      setComments(allComments)
    })
    
    return unscribe
  }
}
/**
 * @param  {Object} authUser: current login user
 * @param  {String} id: postId or commentId according to type
 * @param  {String} content: comment content
 * @param  {String} type: 'post' | 'comment'
 * @param  {String} spaceId: the comment or post belong to the space
 * @param  {fun} setLoading: loading
 */
export const addComment = async (authUser, id, content, type, spaceId, setLoading) => {
  setLoading(true)
  const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
  const colComment = collection(db, COMMENTS_COLLECTION)
  const docAuthUserRef = doc(db, USERS_COLLECTION, authUser.uid)

  const {uid, bucket, displayName} = authUser
  const commentDoc = await addDoc(colComment, {
    author: {uid, bucket, displayName},
    content,
    spaceId,
    parentId: id,
    [type+'Id']: id,
    // Firebase default timestamp generate method
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  });
  
  // After new post created, the related space need push the postId as related
  await updateDoc(docRef, {
    // Firebase default method, push item to array
    commentsId: arrayUnion(commentDoc.id)
  });
  // After new post created, the related author need push the postId as related
  await updateDoc(docAuthUserRef, {
    commentsId: arrayUnion(commentDoc.id)
  })
  setLoading(false)
}

export const updateCommentPost = async (data, type, id) => {
  const docRef = type === TYPE_POST ? doc(db, POSTS_COLLECTION, id) : doc(db, COMMENTS_COLLECTION, id)
  if (type === TYPE_POST) {
    const {title, content} = data
    await updateDoc(docRef, {
      // Firebase default method, push item to array
      title,
      content,
      updatedOn: serverTimestamp(),
    });
  } else {
    await updateDoc(docRef, {
      // Firebase default method, push item to array
      content: data,
      updatedOn: serverTimestamp(),
    });
  }
}

// get space by spaceId for edit space page only
// Eidt space page only need the thumbnail, title, description, keywords, Prerequisites
export const getEditSpaceById = async(spaceId, setPartialSpace, setPreviewPhoto, setLoading) => {
  setLoading(true)
  const docRef = doc(db, SPACES_COLLECTION, spaceId);
  const snapshot =  await getDoc(docRef)
  const space = snapshot.data()
  if (space) {
    const {title, overview, keywords, prerequisites, bucket} = space
    // edit page, we don't need all data, only some
    setPartialSpace({
      title,
      overview,
      keywords,
      prerequisites,
      bucket
    })
    // This is for edit space, other page does not need this, so default is a placeholder fun()
    setPreviewPhoto(await checkBucketData(space.bucket))
    setLoading(false)
  }
}

// get space by spaceId
/**
 * @param  {string} spaceId: params.spaceId
 * @param  {fun} setSpace: bind useEffect setSpace state
 * @param  {fun} setPreviewPhoto: bind useEffect setPreviewPhoto state, this is specific for create/edit space page
 */
export const getSpaceById = async(spaceId, setSpace, setLoading) => {
  setLoading(true)
  const docRef = doc(db, SPACES_COLLECTION, spaceId);
  const unscribe = onSnapshot(docRef, async (snapshot) => {
    const space = snapshot.data()
    if (space) {
      await setSpace({
        ...space,
        thumbnail: await checkBucketData(space.bucket),
        author: {
          ...space.author,
          photoURL: await checkBucketData(space?.author?.bucket)
        },
      })
    }
    setLoading(false)
  })
  return unscribe
}

// get spaces by filtering queryString
export const getSpacesByQueryString = async(keyword, setSpaces, setIsLoading) => {
  setIsLoading(true)
  const q = query(collection(db, SPACES_COLLECTION), where('keyword', "array-contains", keyword));
  const unscribe = onSnapshot(q, async querySnapshot => {
    let allSpaces = [] 
    for (const docSnapshot of querySnapshot.docs) {
      const space = docSnapshot.data()
      await allSpaces.push({
        ...space,
        id: docSnapshot.id
      })
    }
    setSpaces(allSpaces)
    setIsLoading(false)
  })
  return unscribe
}

// get user spaces by uid
export const getUserSpacesById = async(uid, setUserSpaces, authorOrJoin, setLoading) => {
  setLoading(true)
  const q = authorOrJoin === 'author' ? query(collection(db, SPACES_COLLECTION), where('authorUid', '==', uid)) : query(collection(db, SPACES_COLLECTION), where('activeUsersId', "array-contains", uid))
  const unscribe = onSnapshot(q, async querySnapshot => {
    let allSpacesForUser = [] 
    for (const docSnapshot of querySnapshot.docs) {
      
      const space = docSnapshot.data()
      await allSpacesForUser.push({
        ...space,
        thumbnail: await checkBucketData(space.bucket),
        author: {
          ...space.author,
          photoURL: await checkBucketData(space.author.bucket)
        },
        id: docSnapshot.id
      })
    }
    setUserSpaces(allSpacesForUser)
    setLoading(false)
  })
  return unscribe
}

// get user by uid
export const getUserById = async(uid, setUser) => {
  const docRef = doc(db, USERS_COLLECTION, uid)
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // if register user, we don't upload avatar for user, bucket should be null then user potoURL should be null rather than get download the URL or it will throw error
    setUser({...docSnap.data(), photoURL: await checkBucketData(docSnap.data().bucket)})
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// user join space
export const userJoinSpace = async(authUser, spaceId) => {
  if (spaceId) {
    // if (
    // space?.activeUsersId?.indexOf(authUser?.uid)  > -1 ) {
    //   return
    // }

    const {uid, bucket, displayName } = authUser
    const docSpaceRef = doc(db, SPACES_COLLECTION, spaceId)
    const docAuthUserRef = doc(db, USERS_COLLECTION, uid)
    await updateDoc(docSpaceRef, {
      activeUsers: arrayUnion({uid, bucket, displayName}),
      activeUsersId: arrayUnion(uid),
      numOfMembers: increment(1)
    });
    await updateDoc(docAuthUserRef,  {
      spacesId: arrayUnion(spaceId)
    })
  }
}

// user leave space
export const userLeaveSpace = async(authUser, spaceId) => {
  const docSpaceRef = doc(db, SPACES_COLLECTION, spaceId);
  const docAuthUserRef = doc(db, USERS_COLLECTION, authUser.uid)
  const {uid, bucket, displayName} = authUser
  await updateDoc(docSpaceRef, {
    activeUsers: arrayRemove({uid, bucket, displayName}),
    activeUsersId: arrayRemove(authUser.uid),
    numOfMembers: increment(-1)
  });
  
  // if leave, current user spaces should filter the spaceid
  await updateDoc(docAuthUserRef,  {
    spaces: arrayRemove(spaceId)
  })
}

// get user space join leave state
export const getUserSpaceJoinLeaveState = async (spaceId, authUser, setJoined) => {
  if (spaceId) {
    const docRef = doc(db, SPACES_COLLECTION, spaceId);
    await onSnapshot(docRef, async snapshot => {
      if (snapshot.exists) {
        snapshot.data()?.activeUsersId?.indexOf(authUser?.uid) > -1 ? setJoined(true) : setJoined(false)
      } else {
        console.log('Ops')
      }
    })
    
  }
}

// get space activeUsers dynamic after user click join, leave btn
export const getSpaceActiveUsers = async (spaceId, setActiveUsers) => {
  const docRef = doc(db, SPACES_COLLECTION, spaceId);
  await onSnapshot(docRef, async snapshot => {
    if (snapshot.exists) {
      let allActiveUsers = []
      if (snapshot.data()?.activeUsers.length > 0) {

          for (const activeUser of snapshot.data()?.activeUsers) {
            allActiveUsers.push({
              ...activeUser,
              photoURL: await checkBucketData(activeUser.bucket)
            })
          }
          setActiveUsers(allActiveUsers)
      }
    }
  })
}

// get related space base on the keyword
export const getRelatedSpaces = async (keywords, spaceId, setRelatedSpaces, setIsLoading) => {
  setIsLoading(true)
  if (keywords) {
    const q = query(collection(db, SPACES_COLLECTION), where('keywords', "array-contains-any", keywords));
    const querySnapshot = await getDocs(q);
    let allRelatedSpaces = []
    for (const docSnapshot of querySnapshot.docs) {
      const space = docSnapshot.data()
      if (docSnapshot.id !== spaceId) {
        await allRelatedSpaces.push({
          ...space,
          thumbnail: await checkBucketData(space?.bucket),
          author: {
            ...space.author,
            photoURL: await checkBucketData(space?.author?.bucket)
          },
          id: docSnapshot.id
        })
      }
    }
    setRelatedSpaces(allRelatedSpaces)
    setIsLoading(false)
  }
}

// create space by authUser
export const addSpace = async(authUser, spaceField, thumbnail) =>{
  const { uid, bucket, displayName } = authUser
  const docSpaceRef = doc(collection(db, SPACES_COLLECTION))
  await setDoc(docSpaceRef, {
    ...spaceField,
    author: {uid, bucket, displayName},
    authorUid: uid,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
    id: docSpaceRef.id,
    bucket: thumbnail ? await uploadImage(thumbnail, docSpaceRef.id) : '',
    postsId: [],
    activeUsers: [],
    activeUsersId: [],
    numOfMembers: 0
  });
}

// Edit space by authUser
export const updateSpace = async(spaceField, thumbnail, spaceId) => {
  const docSpaceRef = doc(db, SPACES_COLLECTION, spaceId)
  const { title, overview, keywords, prerequisites, bucket } = spaceField
  await updateDoc(docSpaceRef, {
    updatedOn: serverTimestamp(),
    bucket: thumbnail ? await uploadImage(thumbnail, docSpaceRef.id) : bucket,
    title,
    overview,
    keywords,
    prerequisites
  })
}

// Delete space by authUser
export const deleteSpace = async(uid, space) => {
  if (auth.currentUser) {
    const docSpaceRef = doc(db, SPACES_COLLECTION, space.id)
    await deleteDoc(docSpaceRef)

    // if leave, current user spaces should filter the spaceid
    const docAuthUserRef = doc(db, USERS_COLLECTION, uid)
    await updateDoc(docAuthUserRef,  {
      spaces: arrayRemove(space.id)
    })

    // remove the space, need to remove the space thumbnail
    await delStorageImage(space?.id)

    // remove the space need to remove its posts
    if (space?.postsId?.length > 0) {
      space.postsId.forEach(async postId => {
        const docPostRef = doc(db, POSTS_COLLECTION, postId)
        await deleteDoc(docPostRef)
      })
    }

    // remove the space need to revmoe its commments
    const q = query(collection(db, COMMENTS_COLLECTION), where('spaceId', "==", space.id))
    const querySnapshot = await getDocs(q);
    for(const snapshot of querySnapshot.docs) {
      const d = doc(db, COMMENTS_COLLECTION, snapshot.id )
      await deleteDoc(d)
    }
  }
}

const deleteCommentsRecursion = async(snapShotId, docAuthUserRef) => {
  const batch = writeBatch(db)
  const q = query(collection(db, COMMENTS_COLLECTION), where('parentId', "==", snapShotId))
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {

      // Get a new write batch
      for(const snapshot of querySnapshot.docs) {
        const d = doc(db, COMMENTS_COLLECTION, snapshot.id )
        batch.delete(d);
        batch.update(docAuthUserRef, {
          commentsId: arrayRemove(snapshot.id)
        })
        // if this snapshot id of comment has other comments, will run the function again, unless the docs length is 0
        await deleteCommentsRecursion(snapshot.id, docAuthUserRef)
      }
  }
  
  await batch.commit();
}