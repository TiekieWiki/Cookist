import { getData } from '@/utils/global/db';
import { Recipe } from '@/utils/types/recipe';
import { User } from '@/utils/types/user';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);

  /**
   * Get recipes from database
   */
  async function getRecipes(): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes.map((r) => {
          return r.recipeId;
        });
      })
      .then((userRecipes) => {
        if (userRecipes) {
          getData('recipes', where('id', 'in', userRecipes.slice(0, 30)))
            .then((result) => {
              recipes.value = result as Recipe[];
            })
            .catch(() => {
              console.error('No access to recipes');
            });
        }
      })
      .catch(() => {
        console.error('No access to recipes');
      });
  }

  return {
    recipes,
    getRecipes
  };
});
