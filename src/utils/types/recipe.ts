export interface Recipe {
  id: string;
  name: string;
  category: string;
  duration: number;
  portions: number;
  rating: number;
  picture: string;
  ingredients: Ingredient[];
  instructions: string[];
  lastEaten: Date;
  notes: string;
}

export interface Ingredient {
  name: string;
  unit: string;
  amount: number;
}

export enum RecipeCategories {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Dessert = 'Dessert',
  Snack = 'Snack',
  Drink = 'Drink',
  Other = 'Other'
}

export enum RecipeUnits {
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
