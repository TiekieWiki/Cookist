import { getErrorMessage, errorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { User } from '@supabase/supabase-js';
import { Ref, ref } from 'vue';

/**
 * Get the current user
 * @returns {Promise<void>} A promise that resolves when the user is retrieved
 */
export async function getUser(): Promise<{
  errorMessage: Ref<string>;
  user: User | null;
}> {
  const errorMessage = ref<string>('');

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    errorMessage.value = getErrorMessage(errorMessages, error.code);
  }

  return {
    errorMessage,
    user: data.user
  };
}
