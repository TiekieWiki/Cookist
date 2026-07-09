import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { errorMessages, getErrorMessage } from '@/utils/global/errorHandling';
import { User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const user = ref<User>();
  const errorMessage = ref<string>('');

    /**
     * Get the current user
     * @returns A promise that resolves when the user is retrieved or an error message if there was an error
     */
    async function getUser(): Promise<void> {
    const { data, error } = await supabase.auth.getUser();

        if (error) {
            errorMessage.value = getErrorMessage(errorMessages, error.code);
        } else {
            user.value = data.user;
        }
    }

    /**
     * Delete the profile of the current user
     * @returns A promise that resolves when the user profile is deleted or an error message if the deletion fails
     */
    async function deleteUser(): Promise<void> {
      const { data, error } = await supabase.functions.invoke('delete-user');
    
      if (error) {
        errorMessage.value = getErrorMessage(errorMessages, '');
      }
    }
    
  return {
    errorMessage,
    user,
    getUser,
    deleteUser
  };
});
