import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const user = ref<User>();
  const isLoggedIn = ref<boolean>(false);
  const errorMessage = ref<string>('');

    /**
     * Get the current user
     */
    async function getUser(): Promise<void> {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            errorMessage.value = getErrorMessage(error.code);
        } else {
            user.value = data.user;
        }
    }

    /**
     * Delete the profile of the current user
     */
    async function deleteUser(): Promise<void> {
      const { data, error } = await supabase.functions.invoke('delete-user');
    
      if (error) {
        errorMessage.value = getErrorMessage('unknown');
      }
    }

    // Update user's logged in state
    supabase.auth.onAuthStateChange((event, session) => {
      isLoggedIn.value = !!session
    });
    
  return {
    user,
    isLoggedIn,
    errorMessage,
    getUser,
    deleteUser
  };
});
