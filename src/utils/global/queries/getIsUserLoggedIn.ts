import { supabase } from '../supabase';

/**
 * Get if the user is logged in
 * @returns Boolean if the user is logged in
 */
export async function getIsUserLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
}
