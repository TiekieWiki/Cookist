import type { Tables } from './database';

export type GroceryListItem = Tables<'user_grocerylist'> & {
  recipes: { name: string } | null;
};

export interface GroceryListGroup {
  key: string;
  title: string;
  ingredients: GroceryListItem[];
}
