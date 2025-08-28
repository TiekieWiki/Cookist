import router from '@/router';
import { type Auth, GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { addData, getData } from '../global/db';
import { where } from 'firebase/firestore';
import type { User } from '../types/user';
import { DatabaseError } from '../types/errors';
import type { CookGroup } from '../types/cookgroup';

/**
 * Sign in user with Google and register if not already registered
 * @returns {Promise<void>} A promise that resolves when the user is signed in and registered
 */
export async function signInWithGoogle(): Promise<void> {
  // Register or sign in user with google
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(getAuth(), provider);

  getData('users', where('id', '==', result.user.uid))
    .then((data) => {
      if (data.length > 0) {
        // User exists, redirect to recipes
        router.push('/recipes');
        return;
      }
    })
    .catch((error) => {
      if (error instanceof DatabaseError) {
        const uid = getAuth().currentUser?.uid || '';
        const language = navigator.language.includes('nl')
          ? 'nl'
          : navigator.language.includes('en')
            ? 'en'
            : 'en';

        const user: User = {
          id: uid,
          language: language
        };

        // Add user
        addData('users', user).catch((error: any) => {
          console.error('Error adding user to database:', error);
        });

        // Add grocery list
        addData('groceryLists', {
          id: uid,
          ingredients: []
        }).catch((error: any) => {
          console.error('Error adding grocery list to database:', error);
        });

        // Create user's personal cook group
        const cookGroup: CookGroup = {
          id: uid,
          name: '',
          owner: uid,
          personal: true,
          invitees: [],
          members: [uid]
        };

        addData('cookGroups', cookGroup)
          .then(() => {
            router.push('/recipes');
          })
          .catch((error: any) => {
            console.error('Error adding cook group to database:', error);
          });
      } else if (error instanceof Error) {
        console.error('Error signing in user:', error);
      }
    });
}

/** Sign user out and redirect to home page */
export function handleSignOut() {
  const auth: Auth = getAuth();
  signOut(auth)
    .then(() => {
      router.push('/');
    })
    .catch((error) => {
      console.error('Error signing out user:', error);
    });
}
