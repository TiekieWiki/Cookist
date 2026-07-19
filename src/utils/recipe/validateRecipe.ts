import type { Recipe } from '../types/recipe';
import { getErrorMessage } from '../global/errorHandling';

/**
 * Validates a recipe object to ensure all required fields are filled out
 * @param recipe The recipe to validate
 * @returns {string} Validation error message key or empty string if valid
 */
export function validateRecipe(recipe: Recipe): string {
  if (!recipe.name) {
    return getErrorMessage('recipe_name_missing');
  } else if (!recipe.category) {
    return getErrorMessage('recipe_category_missing');
  } else if (recipe.duration === undefined) {
    return getErrorMessage('recipe_duration_missing');
  } else if (recipe.portions === undefined) {
    return getErrorMessage('recipe_portions_missing');
  } else if (recipe.rating === undefined) {
    return getErrorMessage('recipe_rating_missing');
  } else if (
    recipe.ingredients.length <= 0
  ) {
    return getErrorMessage('recipe_ingredients_missing');
  } else if (recipe.instructions.length <= 0) {
    return getErrorMessage('recipe_instructions_missing');
  } else {
    return '';
  }
}
