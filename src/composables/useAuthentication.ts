import { type Ref, ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from 'firebase/auth';
import router from '@/router';

/** Register user or give error message */
export function useRegister(): {
  errorMessageRegister: Ref<string>;
  register: (email: string, password: string) => Promise<void>;
} {
  const errorMessageRegister = ref<string>('');

  const register = async (email: string, password: string) => {
    try {
      // Create user with email and password
      createUserWithEmailAndPassword(getAuth(), email, password);

      // Redirect to recipes page
      router.push('/recipes');
    } catch (error) {
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
    }
  };

  return {
    errorMessageRegister,
    register
  };
}

/** Login user or give error message */
export function useLogin(): {
  errorMessageLogin: Ref<string>;
  login: (email: string, password: string) => Promise<void>;
} {
  const errorMessageLogin = ref<string>('');

  const login = async (email: string, password: string) => {
    try {
      signInWithEmailAndPassword(getAuth(), email, password).then(() => {
        // Redirect to recipes page
        router.push('/recipes');
      });
    } catch (error) {
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
    }
  };

  return {
    errorMessageLogin,
    login
  };
}

/** Check if user is logged in */
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
