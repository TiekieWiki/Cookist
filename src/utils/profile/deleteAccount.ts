import { where } from 'firebase/firestore';
import { deleteData, getData } from '../global/db';
import { deleteUser, getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { deleteImage } from '../global/manageImage';

/*
 * Delete the account
 */
export async function deleteAccount(): Promise<void> {
  const router = useRouter();

  // Delete the user from the database
  deleteData('users', where('id', '==', getAuth().currentUser?.uid))
    .catch((err) => {
      console.error('Error deleting user record:', err);
    })
    .then(async () => {
      // Get the user's recipes to delete images
      return getData('recipes', where('owner', '==', getAuth().currentUser?.uid)).catch((err) => {
        console.error('Error getting recipes:', err);
        return [];
      });
    })
    .then((recipes) => {
      // Delete the user's recipe images
      recipes.forEach((recipe) => {
        if (recipe.image) {
          deleteImage(recipe.image);
        }
      });
    })
    .then(async () => {
      // Delete the user's recipes
      return deleteData('recipes', where('owner', '==', getAuth().currentUser?.uid)).catch(
        (error) => {
          console.error('Error deleting recipes:', error);
        }
      );
    })
    .then(async () => {
      // Get the user's cook groups
      return getData('cookGroups', where('owner', '==', getAuth().currentUser?.uid)).catch(
        (err) => {
          console.error('Error getting cook groups:', err);
          return [];
        }
      );
    })
    .then((cookGroups) => {
      // Delete the user's cook group recipes
      cookGroups.forEach((cookGroup) => {
        deleteData('cookGroupRecipes', where('cookGroupId', '==', cookGroup.id)).catch((err) => {
          console.error(`Error deleting recipes for cook group ${cookGroup.id}:`, err);
        });
      });
    })
    .then(async () => {
      // Delete the user's cook groups
      return deleteData('cookGroups', where('owner', '==', getAuth().currentUser?.uid)).catch(
        (err) => {
          console.error('Error deleting cook groups:', err);
        }
      );
    })
    .then(async () => {
      // Delete the user's grocery list
      return deleteData('groceryList', where('userId', '==', getAuth().currentUser?.uid)).catch(
        (err) => {
          console.error('Error deleting grocery list:', err);
        }
      );
    })
    .then(async () => {
      // Delete the user auth account
      return deleteUser(getAuth().currentUser as any).catch((err) => {
        console.error('Error deleting auth user:', err);
      });
    })
    .then(() => {
      // Redirect to recipes page
      router.push({ path: '/' });
    });
}
