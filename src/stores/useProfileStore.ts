import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { requireUser } from '@/utils/global/requireUser';
import { getSystemLanguage } from '@/utils/global/setLanguage';
import { type Profile } from '@/utils/types/profile';
import { ColorScheme, Handedness, Language } from '@/utils/types/enums';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>();
  const errorMessage = ref<string>('');

  /**
   * Get the profile of the current user
   */
  async function getProfile(): Promise<void> {
    const user = requireUser(errorMessage);
    if (!user) return;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      profile.value = data;
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
    const user = requireUser(errorMessage);
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        language: language,
        colorscheme: colorScheme,
        handedness: handedness
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      profile.value = data;
    }
  }

  /**
   * Set the language of a new user to their system language
   * @param userId Id of the new user
   */
  async function setUsersLocalLanguage(userId: string): Promise<void> {
    errorMessage.value = '';

    const language = getSystemLanguage();

    if (language === Language.EN) return;

    const { data, error } = await supabase
      .from('profiles')
      .update({ language })
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      profile.value = data;
    }
  }

  /**
   * Clear the profile
   */
  function clearProfile(): void {
    profile.value = undefined;
    errorMessage.value = '';
  }

  return {
    profile,
    errorMessage,
    getProfile,
    setProfile,
    setUsersLocalLanguage,
    clearProfile
  };
});
