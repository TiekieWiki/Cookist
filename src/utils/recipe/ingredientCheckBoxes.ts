import type { CheckBoxProps } from '@/utils/types/form';
import type { Ingredient } from '@/utils/types/recipe';

/**
 * Converts ingredients to checkbox items, with the amount as label and the unit in the slot
 * @param ingredients The ingredients to convert
 * @returns {CheckBoxProps[]} A checkbox item for every ingredient
 */
export function toIngredientCheckBoxes(ingredients: Ingredient[]): CheckBoxProps[] {
  return ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    label: ingredient.amount.toString(),
    slot: ingredient.unit
  }));
}
