import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { Profile } from '@/utils/types/profile';
import { useUserStore } from './useUserStore';
import { ColorScheme, Handedness, Language } from '@/utils/types/enums';

export const useProfileStore = defineStore('profile', () => {
  const userStore = useUserStore();
  const profile = ref<Profile>();
  const errorMessage = ref<string>('');

  /**
   * Get the profile of the current user
   */
  async function getProfile(): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userStore.user.id).single();
    
      if (error || !data) {
        errorMessage.value = getErrorMessage('unknown');
      } else {
        profile.value = data;
      }
    }
  }

  /**
   * Set the profile of the current user
   */
  async function setProfile(
    language: Language,
    colorScheme: ColorScheme,
    handedness: Handedness
  ): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage('unknown');
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
        errorMessage.value = getErrorMessage('unknown');
      } else {
        profile.value = data;
      }
    }
  }

  /**
   * Set the local language of the current user
   */
  async function setUsersLocalLanguage(
  ): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      if (navigator.language.includes('nl')) {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              language: 'nl',
            })
            .eq('id', userStore.user.id);
    
          if (error) {
            errorMessage.value = getErrorMessage('unknown');
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
