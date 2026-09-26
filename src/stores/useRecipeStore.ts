import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { requireUser } from '@/utils/global/requireUser';
import { supabase } from '@/utils/global/supabase';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { formatDateAgo, toLocalISODate } from '@/utils/global/date';
import { PostgrestError } from '@supabase/supabase-js';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';

export const useRecipeStore = defineStore('recipe', () => {
  const recipe = ref<Recipe>(emptyRecipe());
  const recipeImage = ref<string>(DEFAULT_RECIPE_IMAGE_SRC);
  const lastEatenDate = ref<string | null>(null);
  const lastEatenRecipe = computed<string>(() => formatDateAgo(lastEatenDate.value));
  const isLoading = ref<boolean>(false);
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
  async function getRecipe(recipeId: string): Promise<void> {
    clearRecipe();

    const request = latestRequest;
    isLoading.value = true;

    const { data, error: recipeError } = await supabase.rpc('get_recipe', {
      p_recipe_id: recipeId
    });

    if (request !== latestRequest) return;

    if (recipeError || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      recipe.value = data.recipe;
      lastEatenDate.value = data.last_eaten;
    }

    isLoading.value = false;

    if (recipeError || !data) return;

    const image = await getRecipeImage(recipeId);

    if (request === latestRequest) {
      recipeImage.value = image;
    }
  }

  /**
   * Save recipe to database
   * @param recipe Recipe to save
   * @param image Image to save
   * @returns {Promise<string | null>} Id of the saved recipe, also when only the image upload failed
   */
  async function setRecipe(newRecipe: Recipe, image: File | null): Promise<string | null> {
    errorMessage.value = '';

    const message = validateRecipe(newRecipe);

    if (message) {
      errorMessage.value = message;
      return null;
    }

    const user = requireUser(errorMessage);
    if (!user) return null;

    let recipeData: any = null;
    let recipeError: PostgrestError | null = null;

    if (newRecipe.id) {
      const { data, error } = await supabase.rpc('update_recipe', {
        p_recipe_id: newRecipe.id,
        p_name: newRecipe.name,
        p_category: newRecipe.category,
        p_duration: newRecipe.duration,
        p_portions: newRecipe.portions,
        p_rating: newRecipe.rating,
        p_notes: newRecipe.notes ?? '',
        p_ingredients: newRecipe.ingredients,
        p_instructions: newRecipe.instructions
      });

      recipeData = data;
      recipeError = error;
    } else {
      const { data, error } = await supabase.rpc('create_recipe', {
        p_name: newRecipe.name,
        p_category: newRecipe.category,
        p_duration: newRecipe.duration,
        p_portions: newRecipe.portions,
        p_rating: newRecipe.rating,
        p_notes: newRecipe.notes ?? '',
        p_ingredients: newRecipe.ingredients,
        p_instructions: newRecipe.instructions
      });

      recipeData = data;
      recipeError = error;
    }

    if (recipeError || !recipeData) {
      errorMessage.value = getErrorMessage('unknown');
      return null;
    }

    recipe.value = Array.isArray(recipeData) ? recipeData[0] : recipeData;

    if (image) {
      const { error: uploadError } = await supabase.storage
        .from('recipe_images')
        .upload(recipe.value.id, image, {
          upsert: true
        });

      if (uploadError) {
        errorMessage.value = getErrorMessage('unknown');
      }
    }

    return recipe.value.id;
  }

  /**
   * Update last eaten date of recipe to today, in the user's timezone
   */
  async function setLastEaten(): Promise<void> {
    const user = requireUser(errorMessage);
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
  }

  /**
   * Delete recipe and its image from database. The recipe is deleted first, so a failed delete
   * never leaves a recipe without its image.
   * @param recipeId Recipe id
   */
  async function deleteRecipe(recipeId: string): Promise<void> {
    const user = requireUser(errorMessage);
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
  }

  /**
   * Clear recipe and ignore running requests, for example before loading another recipe or after
   * logging out
   */
  function clearRecipe(): void {
    latestRequest++;
    recipe.value = emptyRecipe();
    recipeImage.value = DEFAULT_RECIPE_IMAGE_SRC;
    lastEatenDate.value = null;
    isLoading.value = false;
    errorMessage.value = '';
  }

  return {
    recipe,
    recipeImage,
    lastEatenDate,
    lastEatenRecipe,
    isLoading,
    errorMessage,
    getRecipe,
    getRecipeImage,
    setRecipe,
    setLastEaten,
    deleteRecipe,
    clearRecipe
  };
});
