import router from '@/router';
import { type Auth, GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';

/** Sign user in with google or give an alert */
export async function signInWithGoogle() {
  // Register or sign in user with google
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);

  try {
    router.push('/recipes');
  } catch (error: any) {
    alert(error.message);
  }
}

/** Sign user out and redirect to home page */
export function handleSignOut() {
  const auth: Auth = getAuth();
  signOut(auth).then(() => {
    router.push('/');
  });
}
