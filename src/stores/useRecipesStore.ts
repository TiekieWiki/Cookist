import { getErrorMessage } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { combineOrder, splitOrder } from '@/utils/recipes/order';
import {
  emptyFilter,
  OrderBy,
  OrderDirection,
  RecipeOrderCategories,
  type Filter
} from '@/utils/types/orderFilter';
import { type Recipe } from '@/utils/types/recipe';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

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
  const orderBy = ref<OrderBy>(OrderBy.lastEaten);
  const orderDirection = ref<OrderDirection>(OrderDirection.asc);
  const errorMessage = ref<string>('');

  const order = computed<RecipeOrderCategories>({
    get: () => combineOrder(orderBy.value, orderDirection.value),
    set: (value) => {
      const selected = splitOrder(value);

      orderBy.value = selected.orderBy;
      orderDirection.value = selected.orderDirection;
    }
  });

  let timeout: ReturnType<typeof setTimeout> | undefined;
  let latestRequest = 0;

  /**
   * Get recipes from database
   */
  async function getRecipes(): Promise<void> {
    const request = ++latestRequest;
    errorMessage.value = '';

    // Remove the empty ingredient row
    const ingredients = filter.value.ingredients
      .map((ingredient) => ingredient.name.trim())
      .filter((name) => name !== '');

    const { data, error: recipesError } = await supabase.rpc('get_recipes', {
      p_name: filter.value.name,
      p_category: filter.value.category,
      p_duration_min: nullable(filter.value.durationMin),
      p_duration_max: nullable(filter.value.durationMax),
      p_rating_min: nullable(filter.value.ratingMin),
      p_rating_max: nullable(filter.value.ratingMax),
      p_last_eaten_min: nullable(filter.value.lastEatenMin),
      p_last_eaten_max: nullable(filter.value.lastEatenMax),
      p_ingredients: ingredients.length ? ingredients : null,
      p_order_by: orderBy.value,
      p_order_direction: orderDirection.value,
    });

    // Ignore responses of filters that are no longer the current ones
    if (request !== latestRequest) return;

    if (recipesError || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      recipes.value = data;
    }
  }

  /**
   * Reset filter
   */
  function resetFilter() {
    filter.value = emptyFilter();
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

  watch([orderBy, orderDirection], getRecipes);

  return {
    recipes,
    filter,
    orderBy,
    orderDirection,
    order,
    errorMessage,
    getRecipes,
    resetFilter
  };
});
