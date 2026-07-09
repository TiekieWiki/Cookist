import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { Profile } from '@/utils/types/profile';
import { ref, Ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

/**
 * Get the profile of the current user
 * @returns A promise that resolves with the user profile and any error message
 */
export async function getUserProfile(): Promise<{
  errorMessage: Ref<string>;
  profile: Profile | null;
}> {
  const userStore = useUserStore();
  const errorMessage = ref<string>('');

  if (userStore.errorMessage) {
    errorMessage.value = userStore.errorMessage;

    return { errorMessage, profile: null };
  } else if (!userStore.user) {
    errorMessage.value = getErrorMessage(errorMessages, '');

    return { errorMessage, profile: null };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userStore.user.id).single();

  if (error) {
    errorMessage.value = getErrorMessage(errorMessages, '');
  } else if (!data) {
    errorMessage.value = getErrorMessage(errorMessages, '');

    return { errorMessage, profile: null };
  }

  return {
    errorMessage,
    profile: {
      id: data.id,
      language: data.language,
      colorScheme: data.colorscheme,
      handedness: data.handedness
    }
  };
}
