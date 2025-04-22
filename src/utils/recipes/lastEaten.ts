import { Timestamp, where } from 'firebase/firestore';
import type { CookGroupRecipe } from '../types/cookgroup';
import type { Recipe } from '../types/recipe';
import { getData } from '../db';

/**
 * Get the last eaten date of the recipe
 * @param recipe Recipe object
 * @param cookGroupRecipe CookGroupRecipe object
 * @param cookGroup CookGroup object
 * @returns The last eaten date of the recipe in a readable format
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
 * @returns The last eaten date of the recipe in a readable format
 */
export async function getRecipeLastEaten(
  cookGroupRecipeId: string
): Promise<Timestamp | undefined> {
  const cookGroupRecipes = await getData('cookGroupRecipes', where('id', '==', cookGroupRecipeId));
  if (
    cookGroupRecipes &&
    cookGroupRecipes.length > 0 &&
    cookGroupRecipes[0].lastEaten > new Timestamp(0, 0)
  ) {
    return cookGroupRecipes[0].lastEaten;
  } else {
    return undefined;
  }
}
