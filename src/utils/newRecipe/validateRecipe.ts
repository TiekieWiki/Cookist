import i18n from '@/i18n/index';
import type { Recipe } from '../types/recipe';

export function validateRecipe(recipe: Recipe): string {
  if (recipe.name === '') {
    return 'addRecipePage.errors.name';
  } else if (recipe.category === '') {
    return 'addRecipePage.errors.category';
  } else if (recipe.duration === undefined) {
    return 'addRecipePage.errors.duration';
  } else if (recipe.portions === undefined) {
    return 'addRecipePage.errors.portions';
  } else if (recipe.rating === undefined) {
    return 'addRecipePage.errors.rating';
  } else if (
    recipe.ingredients[0].amount === 0 ||
    recipe.ingredients[0].unit === '' ||
    recipe.ingredients[0].name === ''
  ) {
    return 'addRecipePage.errors.ingredients';
  } else if (recipe.instructions[0] === '') {
    return 'addRecipePage.errors.instructions';
  } else {
    return '';
  }
}
