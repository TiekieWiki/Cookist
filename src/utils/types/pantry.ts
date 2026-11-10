import type { Tables } from './database';

export type PantryRecipe = Tables<'recipes'> & {
  recipe_users: { user_id: string; last_eaten: string | null }[];
};

export type PantryItem = Tables<'user_pantry'> & {
  recipes: PantryRecipe | null;
};
