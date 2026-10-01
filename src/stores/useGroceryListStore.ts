import { defineStore } from 'pinia';
import { useLoading } from '@/composables/useLoading';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { requireUser } from '@/utils/global/requireUser';
import { type Ingredient } from '@/utils/types/recipe';

export const useGroceryListStore = defineStore('groceryList', () => {
  const { isLoading, isLoadingAction, trackLoading } = useLoading<
    | 'getGroceryList'
    | 'setGroceryListIngredient'
    | 'setGroceryList'
    | 'deleteGroceryListIngredient'
    | 'deleteGroceryList'
  >();

  const groceryList = ref<Ingredient[]>([]);
  const errorMessage = ref<string>('');

  /**
   * Get the grocery list of the current user
   */
  const getGroceryList = trackLoading('getGroceryList', async (): Promise<void> => {
    const user = await requireUser(errorMessage);
    if (!user) return;

    const { data, error } = await supabase
      .from('user_grocerylist')
      .select('*')
      .eq('user_id', user.id);

    if (error || !data) {
      errorMessage.value = getErrorMessage('unknown');
    } else {
      groceryList.value = data;
    }
  });

  /**
   * Update an ingredient of the grocery list of the current user
   */
  const setGroceryListIngredient = trackLoading(
    'setGroceryListIngredient',
    async (ingredient: Ingredient): Promise<void> => {
      const user = await requireUser(errorMessage);
      if (!user) return;

      if (!ingredient.id) {
        errorMessage.value = getErrorMessage('unknown');
        return;
      }

      const { error } = await supabase
        .from('user_grocerylist')
        .update(ingredient)
        .eq('user_id', user.id)
        .eq('id', ingredient.id);

      if (error) {
        errorMessage.value = getErrorMessage('unknown');
      } else {
        const ingredientIndex = groceryList.value.findIndex((item) => item.id === ingredient.id);
        if (ingredientIndex !== -1) {
          groceryList.value[ingredientIndex] = ingredient;
        } else {
          groceryList.value.push(ingredient);
        }
      }
    },
    (ingredient) => ingredient.id
  );

  /**
   * Add ingredients to the grocery list of the current user
   */
  const setGroceryList = trackLoading(
    'setGroceryList',
    async (ingredients: Ingredient[] | Ingredient): Promise<void> => {
      const user = await requireUser(errorMessage);
      if (!user) return;

      const ingredientArray = Array.isArray(ingredients) ? ingredients : [ingredients];

      const { data, error } = await supabase
        .from('user_grocerylist')
        .insert(ingredientArray.map(({ name, unit, amount }) => ({ name, unit, amount })))
        .select();

      if (error || !data) {
        errorMessage.value = getErrorMessage('unknown');
      } else {
        groceryList.value.push(...data);
      }
    }
  );

  /**
   * Delete an ingredient of the grocery list of the current user
   */
  const deleteGroceryListIngredient = trackLoading(
    'deleteGroceryListIngredient',
    async (ingredientId: string): Promise<void> => {
      const user = await requireUser(errorMessage);
      if (!user) return;

      const { error } = await supabase
        .from('user_grocerylist')
        .delete()
        .eq('user_id', user.id)
        .eq('id', ingredientId);

      if (error) {
        errorMessage.value = getErrorMessage('unknown');
        return;
      }

      groceryList.value = groceryList.value.filter((ingredient) => ingredient.id !== ingredientId);
    },
    (ingredientId) => ingredientId
  );

  /**
   * Delete the grocery list of the current user
   */
  const deleteGroceryList = trackLoading('deleteGroceryList', async (): Promise<void> => {
    const user = await requireUser(errorMessage);
    if (!user) return;

    const { error } = await supabase.from('user_grocerylist').delete().eq('user_id', user.id);

    if (error) {
      errorMessage.value = getErrorMessage('unknown');
      return;
    }

    groceryList.value = [];
  });

  /**
   * Clear the grocery list, for example after logging out
   */
  function clearGroceryList(): void {
    groceryList.value = [];
    errorMessage.value = '';
  }

  return {
    isLoading,
    isLoadingAction,
    groceryList,
    errorMessage,
    getGroceryList,
    setGroceryListIngredient,
    setGroceryList,
    deleteGroceryListIngredient,
    deleteGroceryList,
    clearGroceryList
  };
});
