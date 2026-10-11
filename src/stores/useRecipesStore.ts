import { supabase } from '@/utils/global/supabase';
import { combineOrder, splitOrder } from '@/utils/recipes/order';
import {
  emptyFilter,
  OrderBy,
  OrderDirection,
  RecipeOrderCategories,
  type Filter
} from '@/utils/types/orderFilter';
import { type RecipeSummary } from '@/utils/types/recipe';
import { getRecipeImageUrls, IMAGE_URL_LIFETIME } from '@/utils/recipe/recipeImages';
import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { computed, ref, watch } from 'vue';

const IMAGE_URL_MARGIN = 300;
const GET_RECIPES_LIMIT = 30;

/**
 * Clear an empty input, so the database function uses its default for the filter
 * @param value Value to clear
 * @returns Undefined if empty
 */
function optional<T>(value: T | '' | null | undefined): T | undefined {
  return value === '' || value === null ? undefined : value;
}

export const useRecipesStore = defineStore('recipes', () => {
  const { isLoading, isLoadingAction, errorFor, clearErrors, trackAction } = useActions<
    'getRecipes' | 'getRecipeImages'
  >();

  const recipes = ref<RecipeSummary[]>([]);
  const recipeImages = ref<Record<string, string>>({});
  const filter = ref<Filter>(emptyFilter());
  const orderBy = ref<OrderBy>(OrderBy.lastEaten);
  const orderDirection = ref<OrderDirection>(OrderDirection.asc);
  const recipesOffset = ref<number>(0);
  const hasMoreRecipes = ref<boolean>(true);

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
  let imagesExpireAt = 0;

  /**
   * Get recipes from database
   */
  const getRecipes = trackAction('getRecipes', async (): Promise<void> => {
    const request = ++latestRequest;

    // Remove the empty ingredient row
    const ingredients = filter.value.ingredients
      .map((ingredient) => ingredient.name.trim())
      .filter((name) => name !== '');

    const { data, error: recipesError } = await supabase.rpc('get_recipes', {
      p_name: filter.value.name,
      p_category: optional(filter.value.category),
      p_duration_min: optional(filter.value.durationMin),
      p_duration_max: optional(filter.value.durationMax),
      p_rating_min: optional(filter.value.ratingMin),
      p_rating_max: optional(filter.value.ratingMax),
      p_last_eaten_min: optional(filter.value.lastEatenMin),
      p_last_eaten_max: optional(filter.value.lastEatenMax),
      p_ingredients: ingredients.length ? ingredients : undefined,
      p_order_by: orderBy.value,
      p_order_direction: orderDirection.value,
      p_limit: GET_RECIPES_LIMIT,
      p_offset: recipesOffset.value
    });

    // Ignore responses of filters that are no longer the current ones
    if (request !== latestRequest) return;

    if (recipesError) throw recipesError;

    recipes.value = recipesOffset.value === 0 ? data : [...recipes.value, ...data];
    hasMoreRecipes.value = data.length === GET_RECIPES_LIMIT;

    await getRecipeImages(recipes.value.map((recipe) => recipe.id));
  });

  /**
   * Get signed image URLs for the recipes in one request. URLs that are already known are reused
   * until they are close to expiring, so cards that stay visible after a filter change keep their
   * image. A failure is not shown, because the cards fall back to the default image.
   * @param recipeIds Recipe ids
   */
  const getRecipeImages = trackAction(
    'getRecipeImages',
    async (recipeIds: string[]): Promise<void> => {
      if (Date.now() > imagesExpireAt) {
        recipeImages.value = {};
      }

      const missingIds = recipeIds.filter((id) => !(id in recipeImages.value));
      if (!missingIds.length) return;

      const imageRequest = latestRequest;

      const images = await getRecipeImageUrls(missingIds);

      if (imageRequest !== latestRequest || !images) return;

      if (!Object.keys(recipeImages.value).length) {
        imagesExpireAt = Date.now() + (IMAGE_URL_LIFETIME - IMAGE_URL_MARGIN) * 1000;
      }

      recipeImages.value = { ...recipeImages.value, ...images };
    }
  );

  /**
   * Start over from the first page. Pending requests are ignored and no next page is loaded until
   * the first page is in, so a page of the previous filter can not end up in the new results.
   */
  function restartRecipes(): void {
    clearTimeout(timeout);
    latestRequest++;
    recipesOffset.value = 0;
    hasMoreRecipes.value = false;
  }

  /**
   * Get the recipes from the first page
   */
  function refreshRecipes(): void {
    restartRecipes();
    getRecipes();
  }

  /**
   * Load the next page of recipes
   */
  function loadMoreRecipes(): void {
    if (!hasMoreRecipes.value || isLoadingAction('getRecipes')) return;

    recipesOffset.value += GET_RECIPES_LIMIT;
    getRecipes();
  }

  /**
   * Forget the image URL of a recipe, so the next load requests a fresh one after the image changed
   * @param recipeId Recipe id
   */
  function forgetRecipeImage(recipeId: string): void {
    const images = { ...recipeImages.value };
    delete images[recipeId];
    recipeImages.value = images;
  }

  /**
   * Reset filter
   */
  function resetFilter() {
    filter.value = emptyFilter();
  }

  /**
   * Clear the recipes, for example after logging out
   */
  function clearRecipes(): void {
    restartRecipes();
    recipes.value = [];
    recipeImages.value = {};
    imagesExpireAt = 0;
    clearErrors();
  }

  watch(
    filter,
    () => {
      // Debounce so typing in a filter field does not fire a request per keystroke
      restartRecipes();
      timeout = setTimeout(getRecipes, 300);
    },
    { deep: true }
  );

  watch([orderBy, orderDirection], refreshRecipes);

  return {
    isLoading,
    isLoadingAction,
    errorFor,
    recipes,
    recipeImages,
    filter,
    order,
    hasMoreRecipes,
    getRecipes,
    refreshRecipes,
    loadMoreRecipes,
    forgetRecipeImage,
    resetFilter,
    clearRecipes
  };
});
