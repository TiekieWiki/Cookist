import { type User } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/useUserStore';
import { AppError } from './errorHandling';

/**
 * Get the current user. Waits for the session to be restored first, so actions started while the
 * page loads do not fail for a user who is logged in.
 * @returns {Promise<User>} The current user
 * @throws {AppError} When nobody is logged in
 */
export async function requireUser(): Promise<User> {
  const user = await useUserStore().waitForUser();

  if (!user) throw new AppError('sessionExpired');

  return user;
}
