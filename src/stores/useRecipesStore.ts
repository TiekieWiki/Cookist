import { getErrorMessage } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { emptyFilter, type Filter } from '@/utils/types/orderFilter';
import { type Recipe } from '@/utils/types/recipe';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const filter = ref<Filter>(emptyFilter());
  const errorMessage = ref<string>('');

  /**
   * Get recipes from database
   */
  async function getRecipes(): Promise<void> {
    const { data, error: recipesError } = await supabase.rpc('get_recipes');

    if (recipesError || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      recipes.value = data;
    }
  }

  return {
    recipes,
    filter,
    getRecipes
  };
});
