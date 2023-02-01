import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { storage, BUCKET_URL } from './firebase-config'

import { format } from 'date-fns'

export const uploadImage = async(image, id) => {
  // https://firebase.google.com/docs/storage/web/upload-files
  const formattedDate = format(new Date(), "yyy-MM-dd'T'HH:mm:ss'Z'")
  const metadata = {
    cacheControl: 'public,max-age=300',
  };
  const bucket = `${BUCKET_URL}/${id}/${formattedDate}-${image.name}`
  const storageRef = ref(storage, bucket, metadata)
  await uploadBytes(storageRef, image)
  return bucket
}

export const getDownloadStorageURL = async (bucket) => {
  return await getDownloadURL(ref(storage, bucket))
}

export const delStorageImage = async (id) => {
  console.log(id)
  const listRef = ref(storage, `${BUCKET_URL}/${id}`);
  // Find all the prefixes and items.
  listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
      console.log(folderRef)
    });
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      deleteObject(itemRef)
    });
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
}
