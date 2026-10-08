import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { requireUser } from '@/utils/global/requireUser';
import { getSystemLanguage } from '@/utils/global/setLanguage';
import { type Profile } from '@/utils/types/profile';
import { Language } from '@/utils/types/enums';

export const useProfileStore = defineStore('profile', () => {
  const { isLoading, isLoadingAction, errorFor, clearError, clearErrors, trackAction } = useActions<
    'getProfile' | 'setProfile' | 'setUsersLocalLanguage'
  >();

  const profile = ref<Profile>();

  /**
   * Get the profile of the current user
   */
  const getProfile = trackAction('getProfile', async (): Promise<void> => {
    const user = await requireUser();

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (error) throw error;

    profile.value = data;
  });

  /**
   * Set the profile of the current user
   */
  const setProfile = trackAction(
    'setProfile',
    async (
      language: Profile['language'],
      colorScheme: Profile['colorscheme'],
      handedness: Profile['handedness']
    ): Promise<void> => {
      const user = await requireUser();

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

      if (error) throw error;

      profile.value = data;
    }
  );

  /**
   * Set the language of a new user to their system language. A failure is not shown, because the
   * user can still change the language on the profile page.
   * @param userId Id of the new user
   */
  const setUsersLocalLanguage = trackAction(
    'setUsersLocalLanguage',
    async (userId: string): Promise<void> => {
      const language = getSystemLanguage();

      if (language === Language.EN) return;

      const { data, error } = await supabase
        .from('profiles')
        .update({ language })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      profile.value = data;
    }
  );

  /**
   * Clear the profile
   */
  function clearProfile(): void {
    profile.value = undefined;
    clearErrors();
  }

  return {
    isLoading,
    isLoadingAction,
    errorFor,
    clearError,
    profile,
    getProfile,
    setProfile,
    setUsersLocalLanguage,
    clearProfile
  };
});
