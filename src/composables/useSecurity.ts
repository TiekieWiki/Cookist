import { getData } from '@/utils/global/db';
import { User } from '@/utils/types/user';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';

/**
 * Check if the user has access to the recipe
 * @param recipeId Recipe id
 * @returns Boolean indicating if the user has access to the recipe
 */
export const useAccessRecipe = async (recipeId: string): Promise<boolean> => {
  return getData('users', where('id', '==', getAuth().currentUser?.uid))
    .then((result) => {
      const user = result[0] as User;

      return user.recipes.some((recipe) => recipe.recipeId == recipeId);
    })
    .catch(() => {
      console.error('No access to recipe');
      return false;
    });
};
