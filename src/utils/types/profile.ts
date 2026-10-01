import type { Tables } from './database';

export type Profile = Tables<'profiles'>;

export interface UserStatistics {
  recipesCreated: number;
  averageRating: number;
  neverCooked: number;
}
