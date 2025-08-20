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
