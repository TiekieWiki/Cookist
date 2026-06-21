import { getData, updateData } from '@/utils/global/db';
import { User } from '@/utils/types/user';
import { getAuth } from 'firebase/auth';
import { Timestamp, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLastEatenStore = defineStore('lastEaten', () => {
  const lastEaten = ref<string>('');
  const lastEatenToday = ref<boolean>(false);

  /**
   * Get last eaten of recipe in database
   * @param recipeId Recipe id
   */
  async function getLastEaten(recipeId: string): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes;
      })
      .then((recipes) => {
        if (recipes) {
          lastEaten.value =
            recipes
              .find((r) => {
                r.recipeId == recipeId;
              })
              ?.lastEaten.toDate()
              .toLocaleDateString() || '';
        }
      })
      .catch(() => {
        console.error('No access to recipe');
      });
  }

  /**
   * Update last eaten of recipe in database
   * @param recipeId Recipe id
   */
  async function updateLastEaten(recipeId: string): Promise<void> {
    getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((result) => {
        const user = result[0] as User;

        return user.recipes;
      })
      .then((recipes) => {
        if (recipes) {
          const updatedRecipes = recipes.map((r) => {
            if (r.recipeId == recipeId) {
              r.lastEaten = Timestamp.fromMillis(Date.now());
            }
            return r;
          });

          updateData('users', where('id', '==', getAuth().currentUser?.uid), {
            recipes: updatedRecipes
          })
            .then(() => {
              lastEaten.value = Timestamp.fromMillis(Date.now()).toDate().toLocaleDateString();
              lastEatenToday.value = true;
            })
            .catch(() => {
              console.error('Could not update last eaten');
            });
        }
      })
      .catch(() => {
        console.error('No access to recipe');
      });
  }

  /**
   * Set last eaten
   * @param date Last eaten date
   */
  function setLastEaten(date: Timestamp): void {
    lastEaten.value = date.toDate().toLocaleDateString();
    lastEatenToday.value = date.toDate().toLocaleDateString() === new Date().toLocaleDateString();
  }

  return {
    lastEaten,
    lastEatenToday,
    getLastEaten,
    updateLastEaten,
    setLastEaten
  };
});
