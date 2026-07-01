import { type Ref, ref } from 'vue';
import router from '@/router';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage, passwordLoginErrorMessages } from '@/utils/global/errorHandling';

/**
 * Register user with email and password
 * @returns {Promise<void>} A promise that resolves when the user is registered
 */
export function usePasswordRegister(): {
  errorMessagePasswordRegister: Ref<string>;
  passwordRegister: (email: string, password: string) => Promise<void>;
} {
  const errorMessagePasswordRegister = ref<string>('');

  const passwordRegister = async (email: string, password: string) => {
    if (!email) {
      errorMessagePasswordRegister.value = getErrorMessage(
        passwordLoginErrorMessages,
        'email_address_missing'
      );
      return;
    } else if (!password) {
      errorMessagePasswordRegister.value = getErrorMessage(
        passwordLoginErrorMessages,
        'password_missing'
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      errorMessagePasswordRegister.value = getErrorMessage(passwordLoginErrorMessages, error.code);
      return;
    }

    await router.push('/recipes');
  };

  return {
    errorMessagePasswordRegister,
    passwordRegister
  };
}

/**
 * Login user with email and password
 * @returns {Promise<void>} A promise that resolves when the user is logged in
 */
export function usePasswordLogin(): {
  errorMessagePasswordLogin: Ref<string>;
  passwordLogin: (email: string, password: string) => Promise<void>;
} {
  const errorMessagePasswordLogin = ref<string>('');

  const passwordLogin = async (email: string, password: string) => {
    if (!email) {
      errorMessagePasswordLogin.value = getErrorMessage(
        passwordLoginErrorMessages,
        'email_address_missing'
      );
      return;
    } else if (!password) {
      errorMessagePasswordLogin.value = getErrorMessage(
        passwordLoginErrorMessages,
        'password_missing'
      );
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      errorMessagePasswordLogin.value = error.message;
      return;
    }

    await router.push('/recipes');
  };

  return {
    errorMessagePasswordLogin,
    passwordLogin
  };
}

/**
 * Log out the current user
 * @returns {Promise<void>} A promise that resolves when the user is logged out
 */
export async function useLogout(): Promise<void> {
  await supabase.auth.signOut({ scope: 'local' });

  await router.push('/');
}
