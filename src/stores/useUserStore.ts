import { defineStore } from 'pinia';
import { useLoading } from '@/composables/useLoading';
import { computed, ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { type User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const { isLoading, isLoadingAction, trackLoading } = useLoading<'getUser' | 'deleteUser'>();

  const user = ref<User>();
  const isLoggedIn = computed<boolean>(() => !!user.value);
  const errorMessage = ref<string>('');

  /**
   * Get the current user
   */
  const getUser = trackLoading('getUser', async (): Promise<void> => {
    errorMessage.value = '';

    const { data, error } = await supabase.auth.getUser();

    if (!error) {
      user.value = data.user;
    } else if (error.name === 'AuthSessionMissingError') {
      user.value = undefined;
    } else {
      errorMessage.value = getErrorMessage(error.code);
    }
  });

  /**
   * Delete the profile of the current user
   */
  const deleteUser = trackLoading('deleteUser', async (): Promise<void> => {
    errorMessage.value = '';

    const { error } = await supabase.functions.invoke('delete-user');

    if (error) {
      errorMessage.value = getErrorMessage('unknown');
    }
  });

  let resolveSessionRestored: () => void;
  const sessionRestored = new Promise<void>((resolve) => {
    resolveSessionRestored = resolve;
  });

  /**
   * Wait until the session of a returning user is restored, which happens shortly after the page
   * loads
   * @returns The current user, if logged in
   */
  async function waitForUser(): Promise<User | undefined> {
    await sessionRestored;
    return user.value;
  }

  // Update user when logging in or out
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user;
    resolveSessionRestored();
  });

  return {
    isLoading,
    isLoadingAction,
    user,
    isLoggedIn,
    errorMessage,
    getUser,
    deleteUser,
    waitForUser
  };
});
