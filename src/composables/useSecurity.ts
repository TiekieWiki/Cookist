import { queryCookGroups } from '@/utils/cook group/getCookGroups';
import { getData } from '@/utils/global/db';
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
  return getData('cookGroupRecipes', where('id', '==', cookGroupRecipeId))
    .then((cookGroupRecipes) => {
      if (cookGroupRecipes.length > 0) {
        cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipe;
        return getData('cookGroups', queryCookGroups(getAuth().currentUser?.uid || ''));
      }
    })
    .then((cookGroups) => {
      const hasAccess = (cookGroups as CookGroup[]).some(
        (group) => group.id === cookGroupRecipe.value.cookGroupId
      );

      if (hasAccess) {
        return getData('recipes', where('id', '==', cookGroupRecipe.value.recipeId));
      }
    })
    .then((recipes) => {
      if (recipes && recipes.length > 0) {
        recipe.value = recipes[0] as Recipe;
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.error('Error getting data:', error);
      return false;
    });
};
