import { type Ref, ref } from 'vue';
import router from '@/router';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { useProfileStore } from '@/stores/useProfileStore';

/**
 * Register user with email and password
 * @returns Error message and a function to register the user
 */
export function usePasswordRegister(): {
  errorMessage: Ref<string>;
  passwordRegister: (email: string, password: string) => Promise<void>;
} {
  const profileStore = useProfileStore();
  const errorMessage = ref<string>('');

  const passwordRegister = async (email: string, password: string) => {
    if (!email) {
      errorMessage.value = getErrorMessage(errorMessages, 'email_address_missing');
      return;
    } else if (!password) {
      errorMessage.value = getErrorMessage(errorMessages, 'password_missing');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      errorMessage.value = getErrorMessage(errorMessages, error.code);
      return;
    }

    await profileStore.setUsersLocalLanguage();

    if (profileStore.errorMessage) {
      errorMessage.value = profileStore.errorMessage;
      return;
    }

    await router.push('/recipes');
  };

  return {
    errorMessage,
    passwordRegister
  };
}

/**
 * Login user with email and password
 * @returns Error message and a function to log in the user
 */
export function usePasswordLogin(): {
  errorMessage: Ref<string>;
  passwordLogin: (email: string, password: string) => Promise<void>;
} {
  const errorMessage = ref<string>('');

  const passwordLogin = async (email: string, password: string) => {
    if (!email) {
      errorMessage.value = getErrorMessage(errorMessages, 'email_address_missing');
      return;
    } else if (!password) {
      errorMessage.value = getErrorMessage(errorMessages, 'password_missing');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      errorMessage.value = getErrorMessage(errorMessages, error.code);
      return;
    }

    await router.push('/recipes');
  };

  return {
    errorMessage,
    passwordLogin
  };
}

/**
 * Log out the current user
 * @returns A promise that resolves when the user is logged out
 */
export async function useLogout(): Promise<void> {
  await supabase.auth.signOut({ scope: 'local' });

  await router.push('/');
}
