import { type Ref } from 'vue';
import { type User } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/useUserStore';
import { getErrorMessage } from './errorHandling';

/**
 * Get the current user
 * @param errorMessage Error message to set when there is no user
 * @returns {User | null} The current user, or null when there is no user
 */
export function requireUser(errorMessage: Ref<string>): User | null {
  const userStore = useUserStore();

  errorMessage.value = '';

  if (!userStore.user) {
    errorMessage.value = userStore.errorMessage || getErrorMessage('unknown');
    return null;
  }

  return userStore.user;
}
