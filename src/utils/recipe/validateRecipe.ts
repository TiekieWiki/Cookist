import type { Recipe } from '../types/recipe';
import { getErrorMessage } from '../global/errorHandling';

/**
 * Checks if a form value is missing, including cleared inputs
 * @param value The value to check
 * @returns {boolean} True when the value is undefined, null or an empty string
 */
function isMissing(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

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
  } else if (isMissing(recipe.duration)) {
    return getErrorMessage('recipe_duration_missing');
  } else if (isMissing(recipe.portions)) {
    return getErrorMessage('recipe_portions_missing');
  } else if (isMissing(recipe.rating)) {
    return getErrorMessage('recipe_rating_missing');
  } else if (recipe.ingredients.length <= 0) {
    return getErrorMessage('recipe_ingredients_missing');
  } else if (recipe.instructions.length <= 0) {
    return getErrorMessage('recipe_instructions_missing');
  } else {
    return '';
  }
}
