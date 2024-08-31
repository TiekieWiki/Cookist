import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

/**
 * Upload image to Firebase Storage
 * @param file Image file to upload
 */
export function uploadImage(file: File): void {
  const storage = getStorage();
  const storageRef = ref(storage, file.name);
  uploadBytes(storageRef, file).catch((error) => {
    alert(error);
  });
}

/**
 * Get image from Firebase Storage
 * @param name Image name to get
 * @returns URL of the image
 */
export async function getImage(name: string): Promise<string> {
  const storage = getStorage();
  const imageRef = ref(storage, name);
  const url = await getDownloadURL(imageRef);
  return url;
}

/**
 * Delete image from Firebase Storage
 * @param name Image name to delete
 */
export function deleteImage(name: string): void {
  const storage = getStorage();
  const storageRef = ref(storage, name);
  deleteObject(storageRef).catch((error) => {
    alert(error);
  });
}
