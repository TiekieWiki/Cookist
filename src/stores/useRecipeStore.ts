import { addData, getData, updateData } from '@/utils/global/db';
import { deleteImage, uploadImage } from '@/utils/global/manageImage';
import { emptyRecipe, Recipe } from '@/utils/types/recipe';
import { User } from '@/utils/types/user';
import { getAuth } from 'firebase/auth';
import { Timestamp, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRecipeStore = defineStore('recipe', () => {
  const recipe = ref<Recipe>(emptyRecipe());
  const lastEaten = ref<string>('');
  const lastEatenToday = ref<boolean>(false);

  async function getRecipe(recipeId: string): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes.find((recipe) => recipe.recipeId == recipeId);
      })
      .then((userRecipe) => {
        if (userRecipe) {
          lastEaten.value = userRecipe.lastEaten.toDate().toLocaleDateString();
          lastEatenToday.value =
            userRecipe.lastEaten.toDate().toLocaleDateString() === new Date().toLocaleDateString();

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

  async function saveRecipe(newRecipe: Recipe, image: File): Promise<void> {
    addData('recipes', recipe)
      .then(() => {
        recipe.value = newRecipe;
      })
      .then(() => {
        if (image) {
          uploadImage(image);
        }
      })
      .catch(() => {
        console.error('Could not save recipe');
      });
  }

  async function updateLastEaten(recipeId: string): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes;
      })
      .then((recipes) => {
        if (recipes) {
          const updatedRecipes = recipes.map((r) => {
            if (r.recipeId == recipeId) {
              r.lastEaten = Timestamp.fromMillis(Date.now());
            }
            return r;
          });

          updateData('users', where('id', '==', getAuth().currentUser?.uid), {
            recipes: updatedRecipes
          })
            .then(() => {
              lastEaten.value = Timestamp.fromMillis(Date.now()).toDate().toLocaleDateString();
              lastEatenToday.value = true;
            })
            .catch(() => {
              console.error('Could not update last eaten');
            });
        }
      })
      .catch(() => {
        console.error('No access to recipe');
      });
  }

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

  function clearRecipe(): void {
    recipe.value = emptyRecipe();
  }

  return {
    recipe,
    lastEaten,
    lastEatenToday,
    getRecipe,
    saveRecipe,
    updateLastEaten,
    updateRecipe,
    clearRecipe
  };
});
