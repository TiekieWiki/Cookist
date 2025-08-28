import { and, where } from 'firebase/firestore';
import { getData } from '../global/db';
import type { Recipe } from '../types/recipe';

/**
 * Get the recipes that match the search query
 * @param searchQuery Search query string
 * @param userId ID of the user
 * @returns {Promise<Recipe[]>} - A promise that resolves to an object containing the recipes
 */
export async function getSearchRecipes(searchQuery: string, userId: string): Promise<Recipe[]> {
  // Get users recipes
  return getData('recipes', {
    filters: and(
      ...[
        where('owner', '==', userId),
        where('name', '>=', searchQuery.toLowerCase()),
        where('name', '<=', searchQuery.toLowerCase() + '\uf8ff')
      ]
    ),
    constraints: []
  })
    .then((recipes) => {
      return recipes as Recipe[];
    })
    .catch((error) => {
      console.error('Error getting search recipes:', error);
      return [];
    });
}
