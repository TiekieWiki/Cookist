import type { Ingredient } from './recipe';

export interface GroceryList {
  id: string;
  ingredients: Ingredient[];
}
