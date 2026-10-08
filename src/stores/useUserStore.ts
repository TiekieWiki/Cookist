import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { computed, ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { type User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const { isLoading, isLoadingAction, errorFor, clearError, trackAction } = useActions<
    'getUser' | 'deleteUser'
  >();

  const user = ref<User>();
  const isLoggedIn = computed<boolean>(() => !!user.value);

  /**
   * Get the current user
   */
  const getUser = trackAction('getUser', async (): Promise<void> => {
    const { data, error } = await supabase.auth.getUser();

    if (!error) {
      user.value = data.user;
    } else if (error.name === 'AuthSessionMissingError') {
      user.value = undefined;
    } else {
      throw error;
    }
  });

  /**
   * Delete the account of the current user
   */
  const deleteUser = trackAction('deleteUser', async (): Promise<void> => {
    const { error } = await supabase.functions.invoke('delete-user');

    if (error) throw error;
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
    errorFor,
    clearError,
    user,
    isLoggedIn,
    getUser,
    deleteUser,
    waitForUser
  };
});
