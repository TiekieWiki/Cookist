export interface Recipe {
  id: string;
  owner: string;
  name: string;
  category: string;
  duration: number | undefined;
  portions: number | undefined;
  rating: number | undefined;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  notes: string;
  filterIngredients: string[];
}

export interface Ingredient {
  name: string;
  unit: string;
  amount: number;
}

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
  FluidOunce = 'fl oz',
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

export function emptyRecipe(): Recipe {
  return {
    id: '',
    owner: '',
    name: '',
    category: RecipeCategories.Other,
    duration: undefined,
    portions: undefined,
    rating: undefined,
    image: '',
    ingredients: [{ amount: 0, unit: '', name: '' }],
    instructions: [''],
    notes: '',
    filterIngredients: []
  };
}
