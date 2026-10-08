import type { Recipe } from '../types/recipe';

export type RecipeField =
  | 'name'
  | 'category'
  | 'duration'
  | 'portions'
  | 'rating'
  | 'ingredients'
  | 'instructions';

export type RecipeErrors = Partial<Record<RecipeField, string>>;

/**
 * Checks if a form value is missing, including cleared inputs
 * @param value The value to check
 * @returns {boolean} True when the value is undefined, null or an empty string
 */
function isMissing(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Validates a recipe, so every problem can be shown next to its field at once
 * @param recipe The recipe to validate
 * @returns {RecipeErrors} Translation key of the problem per field, in the order of the form
 */
export function validateRecipe(recipe: Recipe): RecipeErrors {
  const errors: RecipeErrors = {};

  if (!recipe.name?.trim()) {
    errors.name = 'editRecipePage.errors.nameMissing';
  }

  if (!recipe.category) {
    errors.category = 'editRecipePage.errors.categoryMissing';
  }

  if (isMissing(recipe.duration)) {
    errors.duration = 'editRecipePage.errors.durationMissing';
  } else if (Number(recipe.duration) < 1) {
    errors.duration = 'editRecipePage.errors.durationInvalid';
  }

  if (isMissing(recipe.portions)) {
    errors.portions = 'editRecipePage.errors.portionsMissing';
  } else if (Number(recipe.portions) < 1) {
    errors.portions = 'editRecipePage.errors.portionsInvalid';
  }

  if (isMissing(recipe.rating) || Number(recipe.rating) < 0 || Number(recipe.rating) > 5) {
    errors.rating = 'editRecipePage.errors.ratingInvalid';
  }

  if (recipe.ingredients.length <= 0) {
    errors.ingredients = 'editRecipePage.errors.ingredientsMissing';
  }

  if (recipe.instructions.length <= 0) {
    errors.instructions = 'editRecipePage.errors.instructionsMissing';
  }

  return errors;
}
