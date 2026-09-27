import type { Ingredient } from '@/utils/types/recipe';

import { RecipeUnitsPiece, RecipeUnitsVolume, RecipeUnitsWeight } from '../types/recipe';

interface UnitConversion {
  group: 'count' | 'volume' | 'mass';
  toBase: (x: number) => number;
  fromBase: (x: number) => number;
}

// This map defines how to convert between different units
export const unitConversionMap = {
  // Count group
  pc: { group: 'count', toBase: (x: number) => x, fromBase: (x: number) => x },

  // Volume group (base = ml)
  ml: { group: 'volume', toBase: (x: number) => x, fromBase: (x: number) => x },
  dl: {
    group: 'volume',
    toBase: (x: number) => x * 100,
    fromBase: (x: number) => x / 100
  },
  l: {
    group: 'volume',
    toBase: (x: number) => x * 1000,
    fromBase: (x: number) => x / 1000
  },
  tsp: {
    group: 'volume',
    toBase: (x: number) => x * 4.92892,
    fromBase: (x: number) => x / 4.92892
  },
  tbsp: {
    group: 'volume',
    toBase: (x: number) => x * 14.7868,
    fromBase: (x: number) => x / 14.7868
  },
  floz: {
    group: 'volume',
    toBase: (x: number) => x * 29.5735,
    fromBase: (x: number) => x / 29.5735
  },
  cup: {
    group: 'volume',
    toBase: (x: number) => x * 240,
    fromBase: (x: number) => x / 240
  },
  pt: {
    group: 'volume',
    toBase: (x: number) => x * 473.176,
    fromBase: (x: number) => x / 473.176
  },
  qt: {
    group: 'volume',
    toBase: (x: number) => x * 946.353,
    fromBase: (x: number) => x / 946.353
  },
  gal: {
    group: 'volume',
    toBase: (x: number) => x * 3785.41,
    fromBase: (x: number) => x / 3785.41
  },

  // Mass group (base = g)
  mg: {
    group: 'mass',
    toBase: (x: number) => x / 1000,
    fromBase: (x: number) => x * 1000
  },
  g: { group: 'mass', toBase: (x: number) => x, fromBase: (x: number) => x },
  kg: {
    group: 'mass',
    toBase: (x: number) => x * 1000,
    fromBase: (x: number) => x / 1000
  },
  oz: {
    group: 'mass',
    toBase: (x: number) => x * 28.3495,
    fromBase: (x: number) => x / 28.3495
  },
  lb: {
    group: 'mass',
    toBase: (x: number) => x * 453.592,
    fromBase: (x: number) => x / 453.592
  }
} satisfies Record<RecipeUnitsPiece | RecipeUnitsVolume | RecipeUnitsWeight, UnitConversion>;

/**
 * Determines the possible units for an ingredient based on its unit.
 * @param ingredientUnit The unit of the ingredient to check
 * @returns {Record<string, string>} The enum of possible units based on the ingredient unit, or an empty object for unknown units.
 */
export function getPossibleUnits(ingredientUnit: string): Record<string, string> {
  if ((Object.values(RecipeUnitsPiece) as string[]).includes(ingredientUnit))
    return RecipeUnitsPiece;
  else if ((Object.values(RecipeUnitsVolume) as string[]).includes(ingredientUnit))
    return RecipeUnitsVolume;
  else if ((Object.values(RecipeUnitsWeight) as string[]).includes(ingredientUnit))
    return RecipeUnitsWeight;
  else return {};
}

/**
 * Converts an amount from one unit to another, without rounding.
 * @param amount Amount to convert
 * @param fromUnit Unit of the amount
 * @param toUnit Unit to convert to
 * @returns The converted amount, or the original amount when the units cannot be converted
 */
function convertAmount(amount: number, fromUnit: string, toUnit: string): number {
  const from = unitConversionMap[fromUnit as keyof typeof unitConversionMap];
  const to = unitConversionMap[toUnit as keyof typeof unitConversionMap];

  if (!from || !to || from.group !== to.group) return amount;

  return to.fromBase(from.toBase(amount));
}

/**
 * Rounds an amount to 2 decimal places.
 * @param amount Amount to round
 * @returns The rounded amount
 */
function roundAmount(amount: number): number {
  return parseFloat(amount.toFixed(2));
}

/**
 * Converts recipe ingredient unit based on the provided initial ingredient.
 * @param initialIngredient Initial ingredient to use for conversion
 * @param currentIngredient Current ingredient to update
 * @returns Updated ingredient with converted amount and unit
 */
export function updateIngredientUnit(
  initialIngredient: Ingredient,
  currentIngredient: Ingredient
): Ingredient {
  return {
    ...currentIngredient,
    amount: roundAmount(
      convertAmount(initialIngredient.amount, initialIngredient.unit, currentIngredient.unit)
    )
  };
}

/**
 * Converts recipe ingredients units based on the provided initial ingredients and portion counts.
 * The ingredients are matched by position and only rounded after scaling.
 * @param initialIngredients Initial ingredients to use for conversion
 * @param currentIngredients Current ingredients, in the same order, with the units to convert to
 * @param recipePortions Amount of portions the recipe is for
 * @param portionCount Amount of portions to convert to
 * @returns Updated ingredients with converted amount and unit
 */
export function updateIngredientsUnit(
  initialIngredients: Ingredient[],
  currentIngredients: Ingredient[],
  recipePortions: number | undefined,
  portionCount: number | undefined
): Ingredient[] {
  const portionFactor =
    recipePortions && recipePortions > 0 && portionCount != undefined
      ? portionCount / recipePortions
      : 1;

  return initialIngredients.map((initialIngredient, index) => {
    const unit = currentIngredients[index]?.unit ?? initialIngredient.unit;
    const amount = convertAmount(initialIngredient.amount, initialIngredient.unit, unit);

    return {
      ...initialIngredient,
      amount: roundAmount(amount * portionFactor),
      unit
    };
  });
}
