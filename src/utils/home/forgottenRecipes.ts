import type { Recipe } from '../types/recipe';
import { supabase } from '../global/supabase';

/**
 * Gets three longest not eaten recipes
 * @returns {Recipe[]} Three longest not eaten recipes
 */
export async function getForgottenRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.rpc('get_recipes', {
    p_order_by: 'last_eaten',
    p_order_direction: 'asc',
    p_limit: 3,
    p_offset: 0
  });

  if (error || !data) {
    return [];
  } else {
    return data;
  }
}
