import { computed, type ComputedRef, ref } from 'vue';
import router from '@/router';
import { supabase } from '@/utils/global/supabase';
import { type ActionError, type ErrorCode } from '@/utils/global/errorHandling';
import { focusField } from '@/utils/global/focusField';
import { useActions } from '@/composables/useActions';
import { useProfileStore } from '@/stores/useProfileStore';

export type AuthField = 'email' | 'password';
export type AuthErrors = Partial<Record<AuthField, string>>;

const fieldOfCode: Partial<Record<ErrorCode, AuthField>> = {
  emailExists: 'email',
  emailAddressInvalid: 'email',
  weakPassword: 'password'
};

/**
 * Sign in and register with email and password. Problems with one field are shown next to that
 * field, other problems are shown for the whole form.
 * @returns Field and form errors, whether the form is submitting, and functions to submit and to
 * clear the errors
 */
export function useAuthentication(): {
  fieldErrors: ComputedRef<AuthErrors>;
  formError: ComputedRef<ActionError | undefined>;
  isSubmitting: ComputedRef<boolean>;
  submit: (isRegistering: boolean, email: string, password: string) => Promise<void>;
  clearFieldError: (field: AuthField) => void;
  clearAllErrors: () => void;
} {
  const profileStore = useProfileStore();
  const { isLoadingAction, errorFor, clearErrors, trackAction } = useActions<
    'login' | 'register'
  >();
  const validationErrors = ref<AuthErrors>({});

  const serverError = computed<ActionError | undefined>(
    () => errorFor('login') ?? errorFor('register')
  );

  const fieldErrors = computed<AuthErrors>(() => {
    const errors = { ...validationErrors.value };
    const field = serverError.value && fieldOfCode[serverError.value.code];

    if (field) {
      errors[field] = `general.errors.causes.${serverError.value!.code}`;
    }

    return errors;
  });

  const formError = computed<ActionError | undefined>(() =>
    serverError.value && !fieldOfCode[serverError.value.code] ? serverError.value : undefined
  );

  const isSubmitting = computed<boolean>(
    () => isLoadingAction('login') || isLoadingAction('register')
  );

  const login = trackAction('login', async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    await router.push('/recipes');
  });

  const register = trackAction(
    'register',
    async (email: string, password: string): Promise<void> => {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (data.session && data.user) {
        await profileStore.setUsersLocalLanguage(data.user.id);
      }

      await router.push('/recipes');
    }
  );

  /**
   * Check that both fields are filled in
   * @param email Email address
   * @param password Password
   * @returns Whether the form is complete
   */
  function validate(email: string, password: string): boolean {
    const errors: AuthErrors = {};

    if (!email.trim()) errors.email = 'loginPage.errors.emailMissing';
    if (!password) errors.password = 'loginPage.errors.passwordMissing';

    validationErrors.value = errors;

    return !Object.keys(errors).length;
  }

  /**
   * Sign in or register, and focus the field with a problem when there is one
   * @param isRegistering Whether to register instead of sign in
   * @param email Email address
   * @param password Password
   */
  async function submit(isRegistering: boolean, email: string, password: string): Promise<void> {
    clearErrors();

    if (validate(email, password)) {
      await (isRegistering ? register : login)(email, password);
    }

    const firstInvalidField = Object.keys(fieldErrors.value)[0];

    if (firstInvalidField) {
      await focusField(firstInvalidField);
    }
  }

  /**
   * Hide the error of a field once its value changes
   * @param field Field that changed
   */
  function clearFieldError(field: AuthField): void {
    delete validationErrors.value[field];

    if (serverError.value && fieldOfCode[serverError.value.code] === field) {
      clearErrors();
    }
  }

  /**
   * Hide all errors, for example when switching between signing in and registering
   */
  function clearAllErrors(): void {
    validationErrors.value = {};
    clearErrors();
  }

  return { fieldErrors, formError, isSubmitting, submit, clearFieldError, clearAllErrors };
}

/**
 * Log out the current user
 */
export async function useLogout(): Promise<void> {
  await supabase.auth.signOut({ scope: 'local' });

  await router.push('/');
}
