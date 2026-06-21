import { Timestamp, where } from 'firebase/firestore';
import type { CookGroupRecipe } from '../types/cookgroup';
import type { Recipe } from '../types/recipe';
import { getData } from '../global/db';
import { getAuth } from 'firebase/auth';
import { User } from '../types/user';

/**
 * Get the last eaten date of the recipe
 * @param recipe Recipe object
 * @param cookGroupRecipe CookGroupRecipe object
 * @param cookGroup CookGroup object
 * @returns {Timestamp | undefined} The last eaten date of the recipe in a readable format
 */
export function getRecipesLastEaten(
  recipe: Recipe,
  cookGroupRecipes: CookGroupRecipe[],
  cookGroupId: string
): string | undefined {
  const lastEaten = cookGroupRecipes.find(
    (group) => group.cookGroupId === cookGroupId && group.recipeId == recipe.id
  )?.lastEaten;

  if (lastEaten && lastEaten > new Timestamp(0, 0)) {
    return lastEaten.toDate().toLocaleDateString();
  } else {
    return undefined;
  }
}

/**
 * Get the last eaten date of the recipe for the current user
 * @param recipeId Recipe id
 * @returns {Timestamp | undefined} The last eaten date of the recipe in a readable format
 */
export function getRecipeLastEaten(recipeId: string): Timestamp | undefined {
  return getData('users', where('id', '==', getAuth().currentUser?.uid))
    .then((result) => {
      const user = result[0] as User;

      return user.recipes.find((recipe) => recipe.recipeId == recipeId)?.lastEaten as Timestamp;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
}
