import type { Ingredient } from '@/utils/types/recipe';

import { RecipeUnitsPiece, RecipeUnitsVolume, RecipeUnitsWeight } from '../types/recipe';

interface UnitConversion {
  group: 'count' | 'volume' | 'mass';
  toBase: (x: number) => number;
  fromBase: (x: number) => number;
}

export type UnitKey = keyof typeof unitConversionMap;

// This map defines how to convert between different units
export const unitConversionMap = {
  // Count group
  pc: { group: 'count', toBase: (x: number) => x, fromBase: (x: number) => x } as UnitConversion,

  // Volume group (base = ml)
  ml: { group: 'volume', toBase: (x: number) => x, fromBase: (x: number) => x } as UnitConversion,
  dl: {
    group: 'volume',
    toBase: (x: number) => x * 100,
    fromBase: (x: number) => x / 100
  } as UnitConversion,
  l: {
    group: 'volume',
    toBase: (x: number) => x * 1000,
    fromBase: (x: number) => x / 1000
  } as UnitConversion,
  tsp: {
    group: 'volume',
    toBase: (x: number) => x * 4.92892,
    fromBase: (x: number) => x / 4.92892
  } as UnitConversion,
  tbsp: {
    group: 'volume',
    toBase: (x: number) => x * 14.7868,
    fromBase: (x: number) => x / 14.7868
  } as UnitConversion,
  'fl oz': {
    group: 'volume',
    toBase: (x: number) => x * 29.5735,
    fromBase: (x: number) => x / 29.5735
  } as UnitConversion,
  cup: {
    group: 'volume',
    toBase: (x: number) => x * 240,
    fromBase: (x: number) => x / 240
  } as UnitConversion,
  pt: {
    group: 'volume',
    toBase: (x: number) => x * 473.176,
    fromBase: (x: number) => x / 473.176
  } as UnitConversion,
  qt: {
    group: 'volume',
    toBase: (x: number) => x * 946.353,
    fromBase: (x: number) => x / 946.353
  } as UnitConversion,
  gal: {
    group: 'volume',
    toBase: (x: number) => x * 3785.41,
    fromBase: (x: number) => x / 3785.41
  } as UnitConversion,

  // Mass group (base = g)
  mg: {
    group: 'mass',
    toBase: (x: number) => x / 1000,
    fromBase: (x: number) => x * 1000
  } as UnitConversion,
  g: { group: 'mass', toBase: (x: number) => x, fromBase: (x: number) => x } as UnitConversion,
  kg: {
    group: 'mass',
    toBase: (x: number) => x * 1000,
    fromBase: (x: number) => x / 1000
  } as UnitConversion,
  oz: {
    group: 'mass',
    toBase: (x: number) => x * 28.3495,
    fromBase: (x: number) => x / 28.3495
  } as UnitConversion,
  lb: {
    group: 'mass',
    toBase: (x: number) => x * 453.592,
    fromBase: (x: number) => x / 453.592
  } as UnitConversion
};

/**
 * Determines the possible units for an ingredient based on its unit.
 * @param ingredientUnit The unit of the ingredient to check
 * @returns {RecipeUnitsPiece | RecipeUnitsVolume | RecipeUnitsWeight | {}} The enum of possible units based on the ingredient unit.
 */
export function getPossibleUnits(
  ingredientUnit: string
): RecipeUnitsPiece | RecipeUnitsVolume | RecipeUnitsWeight | {} {
  if ((Object.values(RecipeUnitsPiece) as string[]).includes(ingredientUnit))
    return RecipeUnitsPiece;
  else if ((Object.values(RecipeUnitsVolume) as string[]).includes(ingredientUnit))
    return RecipeUnitsVolume;
  else if ((Object.values(RecipeUnitsWeight) as string[]).includes(ingredientUnit))
    return RecipeUnitsWeight;
  else return {};
}

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
export function updateIngredientUnit(
  initialIngredients: Ingredient[],
  currentIngredients: Ingredient[],
  recipePortions: number | undefined,
  portionCount: number | undefined
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
  if (!recipePortions || recipePortions <= 0 || portionCount == undefined)
    return updatedIngredients;

  return updatedIngredients.map((ingredient: Ingredient) => {
    const newAmount = (ingredient.amount / recipePortions) * portionCount;
    return { ...ingredient, amount: newAmount };
  });
}
