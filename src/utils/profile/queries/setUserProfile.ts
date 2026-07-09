import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { ColorScheme, Handedness, Language } from '@/utils/types/enums';
import { ref, Ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

/**
 * Set the profile of the current user
 * @returns A promise that resolves when the user profile is set or an error message if there was an error
 */
export async function setUserProfile(
  language: Language,
  colorScheme: ColorScheme,
  handedness: Handedness
): Promise<{
  errorMessage: Ref<string>;
}> {
    const userStore = useUserStore();
  const errorMessage = ref<string>('');

  if (userStore.errorMessage) {
    errorMessage.value = userStore.errorMessage;

    return { errorMessage };
  } else if (!userStore.user) {
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
    .eq('id', userStore.user.id);

  if (error) {
    errorMessage.value = getErrorMessage(errorMessages, '');
  }

  return { errorMessage };
}
