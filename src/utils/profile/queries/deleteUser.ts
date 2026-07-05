import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { ref, Ref } from 'vue';

/**
 * Delete the profile of the current user
 * @returns {Promise<void>} A promise that resolves when the user profile is deleted
 */
export async function deleteUser(): Promise<{
  errorMessage: Ref<string>;
}> {
  const errorMessage = ref<string>('');

  const { data, error } = await supabase.functions.invoke('delete-user');

  if (error) {
    errorMessage.value = getErrorMessage(errorMessages, '');
  }

  return { errorMessage };
}
