import i18n from '@/i18n';
import type { CheckBoxProps } from '@/utils/types/form';
import type { Ingredient } from '@/utils/types/recipe';

/**
 * Converts ingredients to checkbox items, with the amount, unit and name of the ingredient as the label.
 * @param ingredients The ingredients to convert
 * @returns {CheckBoxProps[]} A checkbox item for every ingredient
 */
export function toIngredientCheckBoxes(ingredients: Ingredient[]): CheckBoxProps[] {
  return ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    label: `${ingredient.amount.toString()} ${i18n.global.t(`general.recipe.units.${ingredient.unit}`, ingredient.amount)} ${ingredient.name.toLocaleLowerCase()}`
  }));
}
