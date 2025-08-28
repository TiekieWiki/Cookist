import { getAuth } from 'firebase/auth';
import { updateData } from '../global/db';
import type { Ingredient } from '../types/recipe';
import { where } from 'firebase/firestore';
import router from '@/router';

/**
 * Add ingredients to the grocery list in the database
 * @param ingredients The ingredients to add to the grocery list
 */
export function addToGroceryList(ingredients: Ingredient[]): void {
  updateData('groceryLists', where('id', '==', getAuth().currentUser?.uid || ''), {
    id: getAuth().currentUser?.uid || '',
    ingredients: ingredients
  }).catch((error: any) => {
    console.error('Error adding ingredients to database:', error);
  });

  // Route to the grocery list page
  router.push('/grocery-list');
}
