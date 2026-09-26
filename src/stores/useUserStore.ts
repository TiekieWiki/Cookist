import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { type User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const user = ref<User>();
  const isLoggedIn = computed<boolean>(() => !!user.value);
  const errorMessage = ref<string>('');

  /**
   * Get the current user
   */
  async function getUser(): Promise<void> {
    errorMessage.value = '';

    const { data, error } = await supabase.auth.getUser();

    if (!error) {
      user.value = data.user;
    } else if (error.name === 'AuthSessionMissingError') {
      user.value = undefined;
    } else {
      errorMessage.value = getErrorMessage(error.code);
    }
  }

  /**
   * Delete the profile of the current user
   */
  async function deleteUser(): Promise<void> {
    errorMessage.value = '';

    const { error } = await supabase.functions.invoke('delete-user');

    if (error) {
      errorMessage.value = getErrorMessage('unknown');
    }
  }

  // Update user when logging in or out
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user;
  });

  return {
    user,
    isLoggedIn,
    errorMessage,
    getUser,
    deleteUser
  };
});
