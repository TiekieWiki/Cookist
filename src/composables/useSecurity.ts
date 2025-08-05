import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import { getData } from '@/utils/db';
import type { CookGroup, CookGroupRecipe } from '@/utils/types/cookgroup';
import type { Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import type { Ref } from 'vue';

/**
 * Check if the user has access to the recipe in the cook group
 * @param cookGroupRecipeId Cook group recipe id
 * @param cookGroupRecipe Cook group recipe ref
 * @param recipe Recipe ref
 * @returns Boolean indicating if the user has access to the recipe
 */
export const useSecureRecipe = async (
  cookGroupRecipeId: string,
  cookGroupRecipe: Ref<CookGroupRecipe>,
  recipe: Ref<Recipe>
): Promise<boolean> => {
  const auth = getAuth();

  return getData('cookGroupRecipes', where('id', '==', cookGroupRecipeId))
    .then((cookGroupRecipes) => {
      if (cookGroupRecipes.length === 0) {
        throw new Error('No cook group recipes found');
      }

      cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipe;
      return getData('cookGroups', getQueryCookGroups(auth.currentUser?.uid || ''));
    })
    .then((cookGroups) => {
      const hasAccess = (cookGroups as CookGroup[]).some(
        (group) => group.id === cookGroupRecipe.value.cookGroupId
      );

      if (!hasAccess) {
        throw new Error('User does not have access to the cook group');
      }

      return getData('recipes', where('id', '==', cookGroupRecipe.value.recipeId));
    })
    .then((recipes) => {
      if (recipes.length === 0) {
        throw new Error('Recipe not found');
      }

      recipe.value = recipes[0] as Recipe;
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};
