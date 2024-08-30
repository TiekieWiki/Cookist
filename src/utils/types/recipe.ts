export interface Recipe {
  id: string;
  name: string;
  category: string;
  duration: number | undefined;
  portions: number | undefined;
  rating: number | undefined;
  picture: string;
  ingredients: Ingredient[];
  instructions: string[];
  lastEaten: Date | undefined;
  notes: string;
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

export enum RecipeUnits {
  Piece = 'pc',
  Milliliters = 'ml',
  Deciliters = 'dl',
  Liters = 'l',
  Teaspoon = 'tsp',
  Tablespoon = 'tbsp',
  FluidOunce = 'fl oz',
  Cup = 'cup',
  Pint = 'pt',
  Quart = 'qt',
  Gallon = 'gal',
  Milligram = 'mg',
  Gram = 'g',
  Kilogram = 'kg',
  Ounce = 'oz',
  Pound = 'lb'
}
