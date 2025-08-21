import { getAuth } from 'firebase/auth';
import { addData } from '../db';
import type { Ingredient } from '../types/recipe';

/**
 * Add ingredients to the grocery list in the database
 * @param ingredients The ingredients to add to the grocery list
 */
export function addToGroceryList(ingredients: Ingredient[]): void {
  addData('groceryLists', {
    id: getAuth().currentUser?.uid || '',
    ingredients: ingredients
  }).catch((error: any) => {
    console.error('Error adding ingredients to database:', error);
  });
}
