import type { Recipe } from '../types/recipe';
import { supabase } from '../global/supabase';
import { OrderBy, OrderDirection } from '../types/orderFilter';

/**
 * Gets three longest not eaten recipes
 * @returns {Recipe[]} Three longest not eaten recipes
 */
export async function getForgottenRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.rpc('get_recipes', {
    p_order_by: OrderBy.lastEaten,
    p_order_direction: OrderDirection.asc,
    p_limit: 3,
    p_offset: 0
  });

  if (error || !data) {
    return [];
  } else {
    return data;
  }
}
