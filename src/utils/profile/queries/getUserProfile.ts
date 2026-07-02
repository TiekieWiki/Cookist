import { getErrorMessage, passwordLoginErrorMessages } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { Profile } from '@/utils/types/profile';

/**
 * Get the profile of the current user
 * @returns Profile of current user or error in console
 */
export async function getUserProfile(): Promise<Profile | void> {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(getErrorMessage(passwordLoginErrorMessages, userError.code));
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();

  if (profileError) {
    console.error(getErrorMessage(passwordLoginErrorMessages, profileError.code));
    return;
  }

  return {
    id: profile.id,
    language: profile.language,
    colorScheme: profile.colorscheme,
    handedness: profile.handedness
  };
}
