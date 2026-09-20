import { getErrorMessage } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { emptyFilter, type Filter } from '@/utils/types/orderFilter';
import { type Recipe } from '@/utils/types/recipe';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

/**
 * Clear input's empty string to null
 * @param value Value to clear
 * @returns Null if empty string
 */
function nullable<T>(value: T | '' | undefined): T | null {
  return value === '' || value === undefined ? null : value;
}

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const filter = ref<Filter>(emptyFilter());
  const errorMessage = ref<string>('');

  let timeout: ReturnType<typeof setTimeout> | undefined;
  let latestRequest = 0;

  /**
   * Get recipes from database
   */
  async function getRecipes(): Promise<void> {
    const request = ++latestRequest;

    const { data, error: recipesError } = await supabase.rpc('get_recipes', {
      p_category: filter.value.category,
      p_duration_min: nullable(filter.value.durationMin),
      p_duration_max: nullable(filter.value.durationMax),
    });

    // Ignore responses of filters that are no longer the current ones
    if (request !== latestRequest) return;

    if (recipesError || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      recipes.value = data;
    }
  }

  watch(
    filter,
    () => {
      // Debounce so typing in a filter field does not fire a request per keystroke
      clearTimeout(timeout);
      timeout = setTimeout(getRecipes, 300);
    },
    { deep: true }
  );

  return {
    recipes,
    filter,
    getRecipes
  };
});
