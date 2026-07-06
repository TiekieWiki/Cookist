import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { Profile } from '@/utils/types/profile';
import { getUser } from '../../global/queries/getUser';
import { ref, Ref } from 'vue';

/**
 * Get the profile of the current user
 * @returns A promise that resolves with the user profile and any error message
 */
export async function getUserProfile(): Promise<{
  errorMessage: Ref<string>;
  profile: Profile | null;
}> {
  const errorMessage = ref<string>('');

  const { errorMessage: userErrorMessage, user } = await getUser();

  if (userErrorMessage.value) {
    errorMessage.value = userErrorMessage.value;

    return { errorMessage, profile: null };
  } else if (!user) {
    errorMessage.value = getErrorMessage(errorMessages, '');

    return { errorMessage, profile: null };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

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
