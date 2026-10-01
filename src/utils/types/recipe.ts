import type { Database } from './database';

export interface Recipe {
  id: string;
  owner: string | undefined;
  name: string;
  category: string;
  duration: number | undefined;
  portions: number | undefined;
  rating: number | undefined;
  ingredients: Ingredient[];
  instructions: Instruction[];
  notes: string | undefined;
  last_eaten?: string | null;
}

export type RecipeSummary = Database['public']['Functions']['get_recipes']['Returns'][number];

export interface RecipeDetails {
  recipe: Recipe;
  last_eaten: string | null;
}

export type Ingredient = {
  id?: string;
  name: string;
  unit: string;
  amount: number;
};

export type Instruction = {
  sort_order: number;
  instruction: string;
};

export enum RecipeCategories {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Dessert = 'dessert',
  Snack = 'snack',
  Drink = 'drink',
  Other = 'other'
}

export enum RecipeUnitsPiece {
  Piece = 'pc'
}

export enum RecipeUnitsVolume {
  Milliliters = 'ml',
  Deciliters = 'dl',
  Liters = 'l',
  Teaspoon = 'tsp',
  Tablespoon = 'tbsp',
  FluidOunce = 'floz',
  Cup = 'cup',
  Pint = 'pt',
  Quart = 'qt',
  Gallon = 'gal'
}

export enum RecipeUnitsWeight {
  Milligram = 'mg',
  Gram = 'g',
  Kilogram = 'kg',
  Ounce = 'oz',
  Pound = 'lb'
}

export const RecipeUnits = { ...RecipeUnitsPiece, ...RecipeUnitsVolume, ...RecipeUnitsWeight };

export function emptyIngredient(): Ingredient {
  return { amount: 0, unit: RecipeUnits.Piece, name: '' };
}

export function emptyInstruction(): Instruction {
  return { sort_order: 0, instruction: '' };
}

export function emptyRecipe(): Recipe {
  return {
    id: '',
    owner: '',
    name: '',
    category: RecipeCategories.Other,
    duration: undefined,
    portions: undefined,
    rating: undefined,
    ingredients: [emptyIngredient()],
    instructions: [emptyInstruction()],
    notes: undefined
  };
}
