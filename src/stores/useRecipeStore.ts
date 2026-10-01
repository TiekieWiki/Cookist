import { emptyRecipe, type Recipe, type RecipeDetails } from '@/utils/types/recipe';
import { defineStore } from 'pinia';
import { useLoading } from '@/composables/useLoading';
import { computed, ref } from 'vue';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { requireUser } from '@/utils/global/requireUser';
import { supabase } from '@/utils/global/supabase';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { formatDateAgo, toLocalISODate } from '@/utils/global/date';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';
import { useRecipesStore } from '@/stores/useRecipesStore';

export const useRecipeStore = defineStore('recipe', () => {
  const { isLoading, isLoadingAction, trackLoading } = useLoading<
    'getRecipe' | 'setRecipe' | 'setLastEaten' | 'deleteRecipe'
  >();

  const recipe = ref<Recipe>(emptyRecipe());
  const recipeImage = ref<string>(DEFAULT_RECIPE_IMAGE_SRC);
  const lastEatenDate = ref<string | null>(null);
  const lastEatenRecipe = computed<string>(() => formatDateAgo(lastEatenDate.value));
  const errorMessage = ref<string>('');

  let latestRequest = 0;

  /**
   * Get recipe image from database
   * @param recipeId Recipe id
   */
  async function getRecipeImage(recipeId: string): Promise<string> {
    const { data: image, error: imageError } = await supabase.storage
      .from('recipe_images')
      .createSignedUrl(recipeId, 3600);

    if (image && !imageError) {
      return image.signedUrl;
    }

    return DEFAULT_RECIPE_IMAGE_SRC;
  }

  /**
   * Get recipe from database
   * @param recipeId Recipe id
   */
  const getRecipe = trackLoading('getRecipe', async (recipeId: string): Promise<void> => {
    clearRecipe();

    const request = latestRequest;

    const { data, error: recipeError } = await supabase.rpc('get_recipe', {
      p_recipe_id: recipeId
    });

    if (request !== latestRequest) return;

    if (recipeError || !data) {
      errorMessage.value = getErrorMessage('unknown');
      return;
    }

    const details = data as unknown as RecipeDetails;

    recipe.value = details.recipe;
    lastEatenDate.value = details.last_eaten;

    const image = await getRecipeImage(recipeId);

    if (request === latestRequest) {
      recipeImage.value = image;
    }
  });

  /**
   * Save recipe to database
   * @param recipe Recipe to save
   * @param image Image to save
   * @returns {Promise<string | null>} Id of the saved recipe, also when only the image upload failed
   */
  const setRecipe = trackLoading(
    'setRecipe',
    async (newRecipe: Recipe, image: File | null): Promise<string | null> => {
      errorMessage.value = '';

      const message = validateRecipe(newRecipe);

      if (message) {
        errorMessage.value = message;
        return null;
      }

      const user = await requireUser(errorMessage);
      if (!user) return null;

      const recipeParams = {
        p_name: newRecipe.name,
        p_category: newRecipe.category,
        p_duration: Number(newRecipe.duration),
        p_portions: Number(newRecipe.portions),
        p_rating: Number(newRecipe.rating),
        p_notes: newRecipe.notes ?? '',
        p_ingredients: newRecipe.ingredients,
        p_instructions: newRecipe.instructions
      };

      const { data: recipeData, error: recipeError } = newRecipe.id
        ? await supabase.rpc('update_recipe', { p_recipe_id: newRecipe.id, ...recipeParams })
        : await supabase.rpc('create_recipe', recipeParams);

      if (recipeError || !recipeData) {
        errorMessage.value = getErrorMessage('unknown');
        return null;
      }

      recipe.value = {
        ...newRecipe,
        ...recipeData,
        notes: recipeData.notes ?? undefined
      };

      if (image) {
        const { error: uploadError } = await supabase.storage
          .from('recipe_images')
          .upload(recipe.value.id, image, {
            upsert: true
          });

        if (uploadError) {
          errorMessage.value = getErrorMessage('unknown');
        } else {
          useRecipesStore().forgetRecipeImage(recipe.value.id);
        }
      }

      return recipe.value.id;
    }
  );

  /**
   * Update last eaten date of recipe to today, in the user's timezone
   */
  const setLastEaten = trackLoading('setLastEaten', async (): Promise<void> => {
    const user = await requireUser(errorMessage);
    if (!user) return;

    const { data, error } = await supabase
      .from('recipe_users')
      .update({
        last_eaten: toLocalISODate(new Date())
      })
      .eq('user_id', user.id)
      .eq('recipe_id', recipe.value.id)
      .select()
      .single();

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      lastEatenDate.value = data.last_eaten;
    }
  });

  /**
   * Delete recipe and its image from database. The recipe is deleted first, so a failed delete
   * never leaves a recipe without its image.
   * @param recipeId Recipe id
   */
  const deleteRecipe = trackLoading('deleteRecipe', async (recipeId: string): Promise<void> => {
    const user = await requireUser(errorMessage);
    if (!user) return;

    const { error: recipeError } = await supabase.from('recipes').delete().eq('id', recipeId);

    if (recipeError) {
      errorMessage.value = getErrorMessage('unknown');
      return;
    }

    if (recipeImage.value !== DEFAULT_RECIPE_IMAGE_SRC) {
      await supabase.storage.from('recipe_images').remove([recipeId]);
    }

    clearRecipe();
  });

  /**
   * Clear recipe and ignore running requests, for example before loading another recipe or after
   * logging out
   */
  function clearRecipe(): void {
    latestRequest++;
    recipe.value = emptyRecipe();
    recipeImage.value = DEFAULT_RECIPE_IMAGE_SRC;
    lastEatenDate.value = null;
    errorMessage.value = '';
  }

  return {
    isLoading,
    isLoadingAction,
    recipe,
    recipeImage,
    lastEatenDate,
    lastEatenRecipe,
    errorMessage,
    getRecipe,
    setRecipe,
    setLastEaten,
    deleteRecipe,
    clearRecipe
  };
});
