import { deleteData } from '../global/db';
import { where } from 'firebase/firestore';

/*
 * Delete the cook group
 * @param {string} cookGroupId - The ID of the cook group to delete
 */
export async function deleteCookGroup(cookGroupId: string): Promise<void> {
  // Delete the cook group
  deleteData('cookGroups', where('id', '==', cookGroupId))
    .then(() => {
      // Delete the cook group recipes
      return deleteData('cookGroupRecipes', where('cookGroupId', '==', cookGroupId));
    })
    .catch((error) => {
      console.error('Error deleting cook group:', error);
    });
}
