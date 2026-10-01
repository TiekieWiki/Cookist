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
import { type RecipeSummary } from '@/utils/types/recipe';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';
import { defineStore } from 'pinia';
import { useLoading } from '@/composables/useLoading';
import { computed, ref, watch } from 'vue';

const IMAGE_URL_LIFETIME = 3600;
const IMAGE_URL_MARGIN = 300;

/**
 * Clear an empty input, so the database function uses its default for the filter
 * @param value Value to clear
 * @returns Undefined if empty
 */
function optional<T>(value: T | '' | null | undefined): T | undefined {
  return value === '' || value === null ? undefined : value;
}

export const useRecipesStore = defineStore('recipes', () => {
  const { isLoading, isLoadingAction, trackLoading } = useLoading<
    'getRecipes' | 'getRecipeImages'
  >();

  const recipes = ref<RecipeSummary[]>([]);
  const recipeImages = ref<Record<string, string>>({});
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
  let imagesExpireAt = 0;

  /**
   * Get recipes from database
   */
  const getRecipes = trackLoading('getRecipes', async (): Promise<void> => {
    const request = ++latestRequest;
    errorMessage.value = '';

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
      p_order_direction: orderDirection.value
    });

    // Ignore responses of filters that are no longer the current ones
    if (request !== latestRequest) return;

    if (recipesError || !data) {
      errorMessage.value = getErrorMessage('unknown');
      return;
    }

    recipes.value = data;
    await getRecipeImages(data.map((recipe) => recipe.id));
  });

  /**
   * Get signed image URLs for the recipes in one request. URLs that are already known are reused
   * until they are close to expiring, so cards that stay visible after a filter change keep their
   * image.
   * @param recipeIds Recipe ids
   */
  const getRecipeImages = trackLoading(
    'getRecipeImages',
    async (recipeIds: string[]): Promise<void> => {
      if (Date.now() > imagesExpireAt) {
        recipeImages.value = {};
      }

      const missingIds = recipeIds.filter((id) => !(id in recipeImages.value));
      if (!missingIds.length) return;

      const imageRequest = latestRequest;

      const { data, error } = await supabase.storage
        .from('recipe_images')
        .createSignedUrls(missingIds, IMAGE_URL_LIFETIME);

      if (imageRequest !== latestRequest || error) return;

      if (!Object.keys(recipeImages.value).length) {
        imagesExpireAt = Date.now() + (IMAGE_URL_LIFETIME - IMAGE_URL_MARGIN) * 1000;
      }

      const signedUrls = new Map(
        data.map((image) => [image.path, image.error ? null : image.signedUrl])
      );

      recipeImages.value = {
        ...recipeImages.value,
        ...Object.fromEntries(
          missingIds.map((id) => [id, signedUrls.get(id) || DEFAULT_RECIPE_IMAGE_SRC])
        )
      };
    }
  );

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
    clearTimeout(timeout);
    latestRequest++;
    recipes.value = [];
    recipeImages.value = {};
    imagesExpireAt = 0;
    errorMessage.value = '';
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
    isLoading,
    isLoadingAction,
    recipes,
    recipeImages,
    filter,
    order,
    errorMessage,
    getRecipes,
    forgetRecipeImage,
    resetFilter,
    clearRecipes
  };
});
