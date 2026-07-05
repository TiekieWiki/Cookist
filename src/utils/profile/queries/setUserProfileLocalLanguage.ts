import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { getUser } from '../../global/queries/getUser';
import { ref, Ref } from 'vue';
import i18n from '@/i18n';

/**
 * Set the local language of the current user
 * @returns {Promise<void>} A promise that resolves when the user profile language is set
 */
export async function setUserProfileLocalLanguage(
): Promise<{
  errorMessage: Ref<string>;
}> {
  const errorMessage = ref<string>('');

  const { errorMessage: userErrorMessage, user } = await getUser();

  if (userErrorMessage.value) {
    errorMessage.value = userErrorMessage.value;

    return { errorMessage };
  } else if (!user) {
    errorMessage.value = getErrorMessage(errorMessages, '');

    return { errorMessage };
  }

  if (navigator.language.includes('nl')) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          language: 'nl',
        })
        .eq('id', user.id);

      if (error) {
        errorMessage.value = getErrorMessage(errorMessages, '');
      }
  }

  return { errorMessage };
}
