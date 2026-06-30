import { type Ref, ref } from 'vue';
import router from '@/router';
import { supabase } from '@/utils/global/supabase';

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
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      errorMessagePasswordRegister.value = error.message;
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
