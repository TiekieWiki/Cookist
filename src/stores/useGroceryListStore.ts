import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { AppError } from '@/utils/global/errorHandling';
import { requireUser } from '@/utils/global/requireUser';
import { type Ingredient } from '@/utils/types/recipe';

export const useGroceryListStore = defineStore('groceryList', () => {
  const { isLoading, isLoadingAction, errorFor, clearError, clearErrors, trackAction } = useActions<
    | 'getGroceryList'
    | 'setGroceryListIngredient'
    | 'setGroceryList'
    | 'deleteGroceryListIngredient'
    | 'deleteGroceryList'
  >();

  const groceryList = ref<Ingredient[]>([]);

  /**
   * Get the grocery list of the current user
   */
  const getGroceryList = trackAction('getGroceryList', async (): Promise<void> => {
    const user = await requireUser();

    const { data, error } = await supabase
      .from('user_grocerylist')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    groceryList.value = data ?? [];
  });

  /**
   * Update an ingredient of the grocery list of the current user
   */
  const setGroceryListIngredient = trackAction(
    'setGroceryListIngredient',
    async (ingredient: Ingredient): Promise<void> => {
      const user = await requireUser();

      if (!ingredient.id) throw new AppError('notFound');

      const { error } = await supabase
        .from('user_grocerylist')
        .update(ingredient)
        .eq('user_id', user.id)
        .eq('id', ingredient.id);

      if (error) throw error;

      const ingredientIndex = groceryList.value.findIndex((item) => item.id === ingredient.id);
      if (ingredientIndex !== -1) {
        groceryList.value[ingredientIndex] = ingredient;
      } else {
        groceryList.value.push(ingredient);
      }
    },
    { id: (ingredient) => ingredient.id, toast: true }
  );

  /**
   * Add ingredients to the grocery list of the current user
   */
  const setGroceryList = trackAction(
    'setGroceryList',
    async (ingredients: Ingredient[] | Ingredient): Promise<void> => {
      await requireUser();

      const ingredientArray = Array.isArray(ingredients) ? ingredients : [ingredients];

      const { data, error } = await supabase
        .from('user_grocerylist')
        .insert(ingredientArray.map(({ name, unit, amount }) => ({ name, unit, amount })))
        .select();

      if (error) throw error;

      groceryList.value.push(...(data ?? []));
    },
    { toast: true }
  );

  /**
   * Delete an ingredient of the grocery list of the current user
   */
  const deleteGroceryListIngredient = trackAction(
    'deleteGroceryListIngredient',
    async (ingredientId: string): Promise<void> => {
      const user = await requireUser();

      const { error } = await supabase
        .from('user_grocerylist')
        .delete()
        .eq('user_id', user.id)
        .eq('id', ingredientId);

      if (error) throw error;

      groceryList.value = groceryList.value.filter((ingredient) => ingredient.id !== ingredientId);
    },
    { id: (ingredientId) => ingredientId, toast: true }
  );

  /**
   * Delete the grocery list of the current user
   */
  const deleteGroceryList = trackAction('deleteGroceryList', async (): Promise<void> => {
    const user = await requireUser();

    const { error } = await supabase.from('user_grocerylist').delete().eq('user_id', user.id);

    if (error) throw error;

    groceryList.value = [];
  });

  /**
   * Clear the grocery list, for example after logging out
   */
  function clearGroceryList(): void {
    groceryList.value = [];
    clearErrors();
  }

  return {
    isLoading,
    isLoadingAction,
    errorFor,
    clearError,
    groceryList,
    getGroceryList,
    setGroceryListIngredient,
    setGroceryList,
    deleteGroceryListIngredient,
    deleteGroceryList,
    clearGroceryList
  };
});
