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

  try {
    // Get the cook group recipe
    const cookGroupRecipes = await getData(
      'cookGroupRecipes',
      where('id', '==', cookGroupRecipeId)
    );
    if (cookGroupRecipes.length > 0) {
      cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipe;

      // Check if the user has access to the cook group recipe
      const cookGroups = (await getData(
        'cookGroups',
        getQueryCookGroups(auth.currentUser?.uid || '')
      )) as CookGroup[];
      if (cookGroups.some((group) => group.id === cookGroupRecipe.value.cookGroupId)) {
        // Get the recipe that needs to be edited
        const recipes = await getData('recipes', where('id', '==', cookGroupRecipe.value.recipeId));
        recipe.value = recipes[0] as Recipe;
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
