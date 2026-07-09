import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { errorMessages, getErrorMessage } from '@/utils/global/errorHandling';
import { Profile } from '@/utils/types/profile';
import { useUserStore } from './useUserStore';
import { ColorScheme, Handedness, Language } from '@/utils/types/enums';

export const useProfileStore = defineStore('profile', () => {
  const userStore = useUserStore();
  const profile = ref<Profile>();
  const errorMessage = ref<string>('');

  /**
   * Get the profile of the current user
   * @returns A promise that resolves when the profile is retrieved or an error message if there was an error
   */
  async function getProfile(): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage(errorMessages, '');
    } else {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userStore.user.id).single();
    
      if (error || !data) {
        errorMessage.value = getErrorMessage(errorMessages, '');
      } else {
        profile.value = data;
      }
    }
  
  }

  /**
   * Set the profile of the current user
   * @returns A promise that resolves when the profile is updated or an error message if there was an error
   */
  async function setProfile(
    language: Language,
    colorScheme: ColorScheme,
    handedness: Handedness
  ): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage(errorMessages, '');
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          language: language,
          colorscheme: colorScheme,
          handedness: handedness
        })
        .eq('id', userStore.user.id);
    
      if (error || !data) {
        errorMessage.value = getErrorMessage(errorMessages, '');
      } else {
        profile.value = data;
      }

    }
  }

  /**
   * Set the local language of the current user
   * @returns A promise that resolves when the user's local language is updated or an error message if there was an error
   */
  async function setUsersLocalLanguage(
  ): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage(errorMessages, '');
    } else {
      if (navigator.language.includes('nl')) {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              language: 'nl',
            })
            .eq('id', userStore.user.id);
    
          if (error) {
            errorMessage.value = getErrorMessage(errorMessages, '');
          } 
      }
    }
  }
  
  return {
    profile,
    errorMessage,
    getProfile,
    setProfile,
    setUsersLocalLanguage
  };
});
