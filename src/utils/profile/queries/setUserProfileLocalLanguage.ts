import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { ref, Ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

/**
 * Set the local language of the current user
 * @returns An object containing the error message if any
 */
export async function setUserProfileLocalLanguage(
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

  return { errorMessage };
}
