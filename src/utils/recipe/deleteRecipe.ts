import { where } from 'firebase/firestore';
import { deleteData } from '../global/db';
import { useRouter } from 'vue-router';

/*
 * Delete the recipe
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
  const router = useRouter();
  // Delete the recipe
  deleteData('recipes', where('id', '==', recipeId))
    .then(() => {
      // Delete the cook group recipes
      return deleteData('cookGroupRecipes', where('recipeId', '==', recipeId));
    })
    .then(() => {
      // Redirect to recipes page
      router.push({ path: '/recipes' });
    })
    .catch((error) => {
      console.error('Error deleting recipe:', error);
    });
}
