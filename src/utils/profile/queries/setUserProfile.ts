import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { getUser } from '../../global/queries/getUser';
import { ColorScheme, Handedness, Language } from '@/utils/types/enums';
import { ref, Ref } from 'vue';

/**
 * Set the profile of the current user
 * @returns {Promise<void>} A promise that resolves when the user profile is set
 */
export async function setUserProfile(
  language: Language,
  colorScheme: ColorScheme,
  handedness: Handedness
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

  const { data, error } = await supabase
    .from('profiles')
    .update({
      language: language,
      colorscheme: colorScheme,
      handedness: handedness
    })
    .eq('id', user.id);

  if (error) {
    errorMessage.value = getErrorMessage(errorMessages, '');
  }

  return { errorMessage };
}
