import type { Ingredient } from '@/utils/types/recipe';

import {
  metricUnits,
  RecipeUnitsPiece,
  RecipeUnitsVolume,
  RecipeUnitsWeight,
  sharedUnits
} from '../types/recipe';

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
 * Converts an amount from one unit to another, without rounding.
 * @param amount Amount to convert
 * @param fromUnit Unit of the amount
 * @param toUnit Unit to convert to
 * @returns The converted amount, or the original amount when the units cannot be converted
 */
export function convertAmount(amount: number, fromUnit: string, toUnit: string): number {
  const conversions: Partial<Record<string, UnitConversion>> = unitConversionMap;
  const from = conversions[fromUnit];
  const to = conversions[toUnit];

  if (!from || !to || from.group !== to.group) return amount;

  return to.fromBase(from.toBase(amount));
}

/**
 * Gets the group of a unit. Amounts in units of the same group can be converted into each other.
 * @param unit Unit to get the group of
 * @returns The group of the unit, or the unit itself for unknown units
 */
export function getUnitGroup(unit: string): string {
  const conversions: Partial<Record<string, UnitConversion>> = unitConversionMap;

  return conversions[unit]?.group ?? unit;
}

/**
 * Rounds an amount to 2 decimal places.
 * @param amount Amount to round
 * @returns The rounded amount
 */
export function roundAmount(amount: number): number {
  return parseFloat(amount.toFixed(2));
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

/**
 * Picks the unit to show an ingredient in for a measuring system. Pieces, spoons and units that
 * already belong to the system are kept, other units become a unit of the system that fits the amount.
 * @param ingredient Ingredient to pick the unit for
 * @param measuringSystem Measuring system of the user
 * @returns The unit to show the ingredient in
 */
export function getPreferredUnit(
  ingredient: Ingredient,
  measuringSystem: 'metric' | 'us_customary'
): string {
  const conversions: Partial<Record<string, UnitConversion>> = unitConversionMap;
  const conversion = conversions[ingredient.unit];
  const isMetric = measuringSystem === 'metric';

  if (!conversion || sharedUnits.includes(ingredient.unit)) return ingredient.unit;
  if (metricUnits.includes(ingredient.unit) === isMetric) return ingredient.unit;

  const base = conversion.toBase(ingredient.amount);

  if (conversion.group === 'mass') {
    if (isMetric) return base >= 1000 ? RecipeUnitsWeight.Kilogram : RecipeUnitsWeight.Gram;
    return base >= 453.592 ? RecipeUnitsWeight.Pound : RecipeUnitsWeight.Ounce;
  }

  if (isMetric) return base >= 1000 ? RecipeUnitsVolume.Liters : RecipeUnitsVolume.Milliliters;
  return base >= 60 ? RecipeUnitsVolume.Cup : RecipeUnitsVolume.Tablespoon;
}
