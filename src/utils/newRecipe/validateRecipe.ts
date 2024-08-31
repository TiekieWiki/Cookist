import i18n from '@/i18n';
import type { Recipe } from '../types/recipe';

export function validateRecipe(recipe: Recipe) {
  if (recipe.name === '') {
    return i18n.global.t('addRecipePage.errors.name');
  } else if (recipe.category === '') {
    return i18n.global.t('addRecipePage.errors.category');
  } else if (recipe.duration === undefined) {
    return i18n.global.t('addRecipePage.errors.duration');
  } else if (recipe.portions === undefined) {
    return i18n.global.t('addRecipePage.errors.portions');
  } else if (recipe.rating === undefined) {
    return i18n.global.t('addRecipePage.errors.rating');
  } else if (
    recipe.ingredients[0].amount === 0 ||
    recipe.ingredients[0].unit === '' ||
    recipe.ingredients[0].name === ''
  ) {
    return i18n.global.t('addRecipePage.errors.ingredients');
  } else if (recipe.instructions[0] === '') {
    return i18n.global.t('addRecipePage.errors.instructions');
  } else {
    return '';
  }
}
