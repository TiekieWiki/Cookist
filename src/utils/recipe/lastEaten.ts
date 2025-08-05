import { Timestamp } from 'firebase/firestore';
import type { CookGroupRecipe } from '../types/cookgroup';
import type { Recipe } from '../types/recipe';

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
 * Get the last eaten date of the cook group recipe
 * @param cookGroupRecipeId CookGroupRecipe id
 * @returns {Timestamp | undefined} The last eaten date of the recipe in a readable format
 */
export function getRecipeLastEaten(cookGroupRecipe: CookGroupRecipe): Timestamp | undefined {
  if (cookGroupRecipe.lastEaten && cookGroupRecipe.lastEaten > new Timestamp(0, 0)) {
    return cookGroupRecipe.lastEaten;
  } else {
    return undefined;
  }
}
