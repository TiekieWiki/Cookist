import { type Ref, ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from 'firebase/auth';
import router from '@/router';
import type { User } from '@/utils/types/user';
import { addData } from '@/utils/global/db';
import type { CookGroup } from '@/utils/types/cookgroup';

/**
 * Register user with email and password
 * @returns {Promise<void>} A promise that resolves when the user is registered
 */
export function useRegister(): {
  errorMessageRegister: Ref<string>;
  register: (email: string, password: string) => Promise<void>;
} {
  const errorMessageRegister = ref<string>('');

  const register = async (email: string, password: string) => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then(() => {
        // Add user to database
        const uid = getAuth().currentUser?.uid || '';
        const user: User = {
          id: uid,
          language: navigator.language.includes('nl')
            ? 'nl'
            : navigator.language.includes('en')
              ? 'en'
              : 'en',
          colorScheme:
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
                ? 'light'
                : 'dark'
        };
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
      })
      .then(() => {
        // Redirect to recipes page
        router.push('/recipes');
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        switch ((error as any).code) {
          case 'auth/invalid-email':
            errorMessageRegister.value = 'loginPage.errors.invalidEmail';
            break;
          case 'auth/wrong-password':
            errorMessageRegister.value = 'loginPage.errors.wrongPassword';
            break;
          case 'auth/email-already-exists':
            errorMessageRegister.value = 'loginPage.errors.emailAlreadyExists';
            break;
          case 'auth/invalid-password':
            errorMessageRegister.value = 'loginPage.errors.invalidPassword';
            break;
          default:
            errorMessageRegister.value = 'loginPage.errors.default';
            break;
        }
      });
  };

  return {
    errorMessageRegister,
    register
  };
}

/**
 * Login user with email and password
 * @returns {Promise<void>} A promise that resolves when the user is logged in
 */
export function useLogin(): {
  errorMessageLogin: Ref<string>;
  login: (email: string, password: string) => Promise<void>;
} {
  const errorMessageLogin = ref<string>('');

  const login = async (email: string, password: string) => {
    // Sign in user with email and password
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(() => {
        // Redirect to recipes page
        router.push('/recipes');
      })
      .catch((error) => {
        console.error('Error logging in user:', error);
        switch ((error as any).code) {
          case 'auth/invalid-email':
            errorMessageLogin.value = 'loginPage.errors.invalidEmail';
            break;
          case 'auth/user-not-found':
            errorMessageLogin.value = 'loginPage.errors.userNotFound';
            break;
          case 'auth/wrong-password':
            errorMessageLogin.value = 'loginPage.errors.wrongPassword';
            break;
          default:
            errorMessageLogin.value = 'loginPage.errors.default';
            break;
        }
      });
  };

  return {
    errorMessageLogin,
    login
  };
}

/**
 * Check if user is logged in
 * @returns {Ref<boolean>} A ref that is true if user is logged in, false otherwise
 */
export function useIsLoggedIn(): Ref<boolean> {
  const isLoggedIn = ref<boolean>(false);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });

  return isLoggedIn;
}
