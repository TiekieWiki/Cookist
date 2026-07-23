import { deleteData, getData, updateData } from '@/utils/global/db';
import { deleteImage, uploadImage } from '@/utils/global/manageImage';
import { emptyRecipe, Recipe } from '@/utils/types/recipe';
import { User } from '@/utils/types/profile';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLastEatenStore } from './useLastEatenStore';
import { useUserStore } from './useUserStore';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { supabase } from '@/utils/global/supabase';
import { validateRecipe } from '@/utils/recipe/validateRecipe';

export const useRecipeStore = defineStore('recipe', () => {
  const userStore = useUserStore();
  const recipe = ref<Recipe>(emptyRecipe());
  const recipeImage = ref<File | null>(null);
  const lastEatenStore = useLastEatenStore();
  const errorMessage = ref<string>('');

  /**
   * Get recipe from database
   * @param recipeId Recipe id
   */
  async function getRecipe(recipeId: string): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes.find((recipe: any) => recipe.recipeId == recipeId);
      })
      .then((userRecipe) => {
        if (userRecipe) {
          lastEatenStore.setLastEaten(userRecipe.lastEaten);

          getData('recipes', where('id', '==', recipeId))
            .then((result) => {
              recipe.value = result[0] as Recipe;
            })
            .catch(() => {
              console.error('No access to recipe');
            });
        }
      })
      .catch(() => {
        console.error('No access to recipe');
      });
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
   * Update recipe in database
   * @param newRecipe Recipe to update
   * @param image Image to save
   * @param oldImage Old saved image name
   */
  async function updateRecipe(newRecipe: Recipe, image: File, oldImage: string): Promise<void> {
    updateData('recipes', where('id', '==', newRecipe.id), recipe)
      .then(() => {
        recipe.value = newRecipe;
      })
      .then(() => {
        if (image && image.name !== oldImage) {
          uploadImage(image);
          deleteImage(oldImage);
        }
      })
      .catch(() => {
        console.error('Could not update recipe');
      });
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
    errorMessage,
    getRecipe,
    setRecipe,
    updateRecipe,
    deleteRecipe,
    clearRecipe
  };
});
