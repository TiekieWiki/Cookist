import type { Tables } from './database';

export type PantryItem = Tables<'user_pantry'> & {
  recipes: { name: string } | null;
};
