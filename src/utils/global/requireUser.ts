import { type Ref } from 'vue';
import { type User } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/useUserStore';
import { getErrorMessage } from './errorHandling';

/**
 * Get the current user. Waits for the session to be restored first, so actions started while the
 * page loads do not fail for a user who is logged in.
 * @param errorMessage Error message to set when there is no user
 * @returns {Promise<User | null>} The current user, or null when there is no user
 */
export async function requireUser(errorMessage: Ref<string>): Promise<User | null> {
  const userStore = useUserStore();

  errorMessage.value = '';

  const user = await userStore.waitForUser();

  if (!user) {
    errorMessage.value = userStore.errorMessage || getErrorMessage('unknown');
    return null;
  }

  return user;
}
