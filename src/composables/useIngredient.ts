import { unitConversionMap } from '@/utils/recipe/ingredientUnits';
import type { Ingredient } from '@/utils/types/recipe';
import { type Ref } from 'vue';

/**
 * Converts recipe ingredient units based on the provided initial ingredients and portion counts.
 * @param initialIngredients Initial ingredients to use for conversion
 * @param currentIngredients Current ingredients to update
 * @param ingredient Ingredient to convert
 * @param ingredientIndex Index of the ingredient in the initial ingredients array
 * @param recipePortions Amount of portions the recipe is for
 * @param portionCount Amount of portions to convert to
 * @returns Updated ingredient with converted amount and unit
 */
export function useIngredientUnit(
  initialIngredients: Ingredient[],
  currentIngredients: Ingredient[],
  recipePortions: number | undefined,
  portionCount: Ref<number>
): Ingredient[] {
  let updatedIngredients = JSON.parse(JSON.stringify(initialIngredients));

  // Use initial ingredients to determine new amount based on unit conversion
  updatedIngredients = updatedIngredients.map((ingredient: Ingredient) => {
    const initialIngredient = initialIngredients.find((ing) => ing.name === ingredient.name);
    const currentIngredient = currentIngredients.find((ing) => ing.name === ingredient.name);

    if (initialIngredient && currentIngredient) {
      const currentUnit =
        unitConversionMap[initialIngredient.unit as keyof typeof unitConversionMap];
      const baseAmount = currentUnit.toBase(initialIngredient.amount);
      const toUnit = unitConversionMap[currentIngredient.unit as keyof typeof unitConversionMap];
      const convertedAmount = toUnit.fromBase(baseAmount);

      return {
        ...ingredient,
        amount: parseFloat(convertedAmount.toFixed(2)), // Round to 2 decimal places
        unit: currentIngredient.unit
      };
    } else {
      return { ...ingredient };
    }
  });

  // Convert the ingredient amount based on the recipe's portion count
  if (!recipePortions || recipePortions <= 0) return updatedIngredients;

  return updatedIngredients.map((ingredient: Ingredient) => {
    const newAmount = (ingredient.amount / recipePortions) * portionCount.value;
    return { ...ingredient, amount: newAmount };
  });
}
