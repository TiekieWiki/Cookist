import type { Recipe } from '../types/recipe';

/**
 * Validates a recipe object to ensure all required fields are filled out
 * @param recipe The recipe to validate
 * @returns {string} Validation error message key or empty string if valid
 */
export function validateRecipe(recipe: Recipe): string {
  if (recipe.name === '') {
    return 'editRecipePage.errors.name';
  } else if (recipe.category === '') {
    return 'editRecipePage.errors.category';
  } else if (recipe.duration === undefined) {
    return 'editRecipePage.errors.duration';
  } else if (recipe.portions === undefined) {
    return 'editRecipePage.errors.portions';
  } else if (recipe.rating === undefined) {
    return 'editRecipePage.errors.rating';
  } else if (
    recipe.ingredients[0].amount === 0 ||
    recipe.ingredients[0].unit === '' ||
    recipe.ingredients[0].name === ''
  ) {
    return 'editRecipePage.errors.ingredients';
  } else if (recipe.instructions[0] === '') {
    return 'editRecipePage.errors.instructions';
  } else {
    return '';
  }
}
