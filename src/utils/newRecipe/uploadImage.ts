import { getStorage, ref, uploadBytes } from 'firebase/storage';

/**
 * Upload image to Firebase Storage
 * @param file Image file to upload
 */
export function uploadImage(file: File) {
  const storage = getStorage();
  const storageRef = ref(storage, file.name);
  uploadBytes(storageRef, file).catch((error) => {
    alert(error);
  });
}
