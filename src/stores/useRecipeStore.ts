import { deleteData } from '@/utils/global/db';
import { emptyRecipe, Recipe } from '@/utils/types/recipe';
import { where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './useUserStore';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { formatDate } from '@/utils/global/date';

export const useRecipeStore = defineStore('recipe', () => {
  const userStore = useUserStore();
  const recipe = ref<Recipe>(emptyRecipe());
  const recipeImage = ref<File | null>(null);
  const lastEatenRecipe = ref<string | null>(null);
  const errorMessage = ref<string>('');

  /**
   * Get recipe from database
   * @param recipeId Recipe id
   */
  async function getRecipe(recipeId: string): Promise<void> {
    const { data, error } =
      await supabase.rpc('get_recipe', {
        p_recipe_id: recipeId
      });

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      recipe.value = data.recipe;
      lastEatenRecipe.value = formatDate(data.last_eaten);
    }
  }

  /**
   * Save recipe to database
   * @param recipe Recipe to save
   * @param image Image to save
   */
  async function setRecipe(newRecipe: Recipe, image: File | null): Promise<void> {
    const message = validateRecipe(newRecipe);

    if (message) {
      errorMessage.value = message;
    }
    else if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      const { data, error: recipeError } =
        await supabase.rpc('create_recipe', {
          p_name: newRecipe.name,
          p_category: newRecipe.category,
          p_duration: newRecipe.duration,
          p_portions: newRecipe.portions,
          p_rating: newRecipe.rating,
          p_notes: newRecipe.notes ?? '',
          p_ingredients: newRecipe.ingredients,
          p_instructions: newRecipe.instructions
        })

      if (recipeError || !data) {
        errorMessage.value = getErrorMessage('unknown');
      } else {
        recipe.value = Array.isArray(data) ? data[0] : data;

        if (image) {
          const { error: uploadError } = await supabase.storage
            .from('recipe_images')
            .upload(recipe.value.id, image, {
              upsert: true
            });

          if (uploadError) {
            errorMessage.value = getErrorMessage('unknown');
          } else {
            recipeImage.value = image;
          }
        }
      }
    }
  }

  /**
   * Update last eaten date of recipe to today
   */
  async function setLastEaten(): Promise<void> {
    if (userStore.errorMessage) {
      errorMessage.value = userStore.errorMessage;
    } else if (!userStore.user) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      const { data, error } = await supabase
        .from('recipe_users')
        .update({
          last_eaten: new Date(),
        })
        .eq('user_id', userStore.user.id)
        .eq('recipe_id', recipe.value.id)
        .select()
        .single();
    
      if (error || !data) {
        errorMessage.value = getErrorMessage('unknown');
      } else {
        lastEatenRecipe.value = formatDate(data.last_eaten);
      }
    }
  }

  /**
   * Delete recipe from database
   * @param recipeId Recipe id
   */
  async function deleteRecipe(recipeId: string): Promise<void> {
    const router = useRouter();
    // Delete the recipe
    deleteData('recipes', where('id', '==', recipeId))
      .then(() => {
        if (recipe.value.id == recipeId) {
          recipe.value = emptyRecipe();
        }

        router.push({ path: '/recipes' });
      })
      .catch((error) => {
        console.error('Error deleting recipe:', error);
      });
  }

  /**
   * Clear recipe
   */
  function clearRecipe(): void {
    recipe.value = emptyRecipe();
  }

  return {
    recipe,
    recipeImage,
    lastEatenRecipe,
    errorMessage,
    getRecipe,
    setRecipe,
    setLastEaten,
    deleteRecipe,
    clearRecipe
  };
});
