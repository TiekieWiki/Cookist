import router from '@/router';
import { type Auth, GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { addData, getData } from './db';
import { where } from 'firebase/firestore';
import type { User } from './types/user';
import { DatabaseError } from './types/errors';
import type { CookGroup } from './types/cookgroup';

/** Sign user in with google or give an alert */
export async function signInWithGoogle() {
  // Register or sign in user with google
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(getAuth(), provider);

  try {
    // Check if user is registered
    const data = await getData('users', where('id', '==', result.user.uid));
    if (data.length > 0) {
      // Redirect to recipes page
      router.push('/recipes');
    }
  } catch (error) {
    console.error(error);
    if (error instanceof DatabaseError) {
      // Register user
      const user: User = {
        id: getAuth().currentUser?.uid,
        language: navigator.language.includes('nl')
          ? 'nl'
          : navigator.language.includes('en')
            ? 'en'
            : 'en'
      };
      addData('users', user).catch((error: any) => {
        alert(error.message);
      });

      // Create user's personal cook group
      const cookGroup: CookGroup = {
        id: crypto.randomUUID(),
        name: '',
        owner: getAuth().currentUser?.uid || '',
        personal: true,
        invitees: [],
        members: [getAuth().currentUser?.uid || '']
      };
      addData('cookGroups', cookGroup)
        .then(() => {
          // Redirect to recipes page
          router.push('/recipes');
        })
        .catch((error: any) => {
          alert(error.message);
        });
    } else if (error instanceof Error) {
      alert(error.message);
    }
  }
}

/** Sign user out and redirect to home page */
export function handleSignOut() {
  const auth: Auth = getAuth();
  signOut(auth).then(() => {
    router.push('/');
  });
}
