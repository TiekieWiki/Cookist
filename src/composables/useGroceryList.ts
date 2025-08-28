import { getData, updateData } from '@/utils/global/db';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import type { GroceryList, Ingredient } from '@/utils/types/groceryList';
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';

/**
 * Composable for managing the grocery list
 * @returns Grocery list state and methods
 */
export function useGroceryList() {
  const initialGroceryList = ref<GroceryList>({
    id: '',
    ingredients: []
  });
  const groceryList = ref<GroceryList>({
    id: '',
    ingredients: []
  });
  const newIngredient = ref<Ingredient>({
    amount: 0,
    unit: '',
    name: ''
  });
  const errorMessage = ref<string>('');

  // Get the grocery list
  onMounted(async () => {
    await getData('groceryLists', where('id', '==', getAuth().currentUser?.uid))
      .then((list) => {
        if (list.length > 0) {
          initialGroceryList.value = list[0] as GroceryList;
          groceryList.value = {
            ...initialGroceryList.value,
            ingredients: JSON.parse(JSON.stringify(initialGroceryList.value.ingredients))
          };
        }
      })
      .catch((error: any) => {
        console.error('Error getting grocery list:', error);
      });
  });

  /**
   * Update the ingredient unit
   */
  function changeIngredientUnit(): void {
    groceryList.value.ingredients = updateIngredientUnit(
      initialGroceryList.value.ingredients,
      groceryList.value.ingredients,
      undefined,
      undefined
    );

    // Update the grocery list in the database
    updateData(
      'groceryLists',
      where('id', '==', getAuth().currentUser?.uid),
      groceryList.value
    ).catch((error) => {
      console.error('Error updating grocery list:', error);
    });
  }

  /**
   * Add a new ingredient to the grocery list
   */
  function addIngredient(): void {
    if (
      newIngredient.value.name.trim() === '' ||
      newIngredient.value.unit === '' ||
      newIngredient.value.amount <= 0
    ) {
      errorMessage.value = 'groceryListPage.errors.invalidIngredient';
      return;
    }

    // Add the new ingredient to the grocery list
    groceryList.value.ingredients.push({
      ...newIngredient.value,
      name: newIngredient.value.name.toLowerCase()
    });

    // Reset the new ingredient input
    newIngredient.value = { amount: 0, unit: '', name: '' };

    // Update the grocery list in the database
    updateData(
      'groceryLists',
      where('id', '==', getAuth().currentUser?.uid),
      groceryList.value
    ).catch((error) => {
      console.error('Error updating grocery list:', error);
    });
  }

  /**
   * Delete an ingredient from the grocery list
   * @param index The index of the ingredient to delete
   */
  function deleteIngredient(index: number): void {
    groceryList.value.ingredients.splice(index, 1);

    // Update the grocery list in the database
    updateData(
      'groceryLists',
      where('id', '==', getAuth().currentUser?.uid),
      groceryList.value
    ).catch((error) => {
      console.error('Error updating grocery list:', error);
    });
  }

  // Empty the grocery list
  const emptyGroceryListOpen = ref<boolean>(false);

  /**
   * Empty the grocery list
   */
  function emptyGroceryList(): void {
    groceryList.value.ingredients = [];
    emptyGroceryListOpen.value = false;

    // Update the grocery list in the database
    updateData(
      'groceryLists',
      where('id', '==', getAuth().currentUser?.uid),
      groceryList.value
    ).catch((error) => {
      console.error('Error updating grocery list:', error);
    });
  }

  return {
    groceryList,
    newIngredient,
    errorMessage,
    emptyGroceryListOpen,
    addIngredient,
    deleteIngredient,
    emptyGroceryList,
    changeIngredientUnit
  };
}
