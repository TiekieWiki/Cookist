import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { requireUser } from '@/utils/global/requireUser';
import type { PantryItem } from '@/utils/types/pantry';
import { useProfileStore } from './useProfileStore';

export const usePantryStore = defineStore('pantry', () => {
  const { isLoading, isLoadingAction, errorFor, clearError, clearErrors, trackAction } = useActions<
    'getPantry' | 'setPantry' | 'deletePantryRecipe' | 'deletePantry'
  >();

  const profileStore = useProfileStore();

  const pantry = ref<PantryItem[]>([]);

  /**
   * Check whether the current user uses the pantry, after waiting for their profile to load
   * @returns Whether the pantry is turned on
   */
  async function usesPantry(): Promise<boolean> {
    return !!(await profileStore.whenProfileLoaded())?.use_pantry;
  }

  /**
   * Get the pantry of the current user
   */
  const getPantry = trackAction('getPantry', async (): Promise<void> => {
    const user = await requireUser();

    if (!(await usesPantry())) return;

    const { data, error } = await supabase
      .from('user_pantry')
      .select('*, recipes(name)')
      .eq('user_id', user.id);

    if (error) throw error;

    pantry.value = data ?? [];
  });

  /**
   * Add recipe to the pantry of the current user. The same recipe can be added more than once.
   * @param recipeId Id of the recipe to add to the pantry
   */
  const setPantry = trackAction(
    'setPantry',
    async (recipeId: string): Promise<void> => {
      const user = await requireUser();

      if (!(await usesPantry())) return;

      const { data, error } = await supabase
        .from('user_pantry')
        .insert({
          recipe_id: recipeId,
          user_id: user.id
        })
        .select('*, recipes(name)');

      if (error) throw error;

      pantry.value.push(...(data ?? []));
    },
    { toast: true }
  );

  /**
   * Delete a recipe from the pantry of the current user. When the recipe was added more than once,
   * only one of them is deleted. Nothing happens when the recipe is not in the pantry.
   * @param recipeId Id of the recipe to delete from the pantry
   */
  const deletePantryRecipe = trackAction(
    'deletePantryRecipe',
    async (recipeId: string): Promise<void> => {
      const user = await requireUser();

      if (!(await usesPantry())) return;

      const { data: item, error: selectError } = await supabase
        .from('user_pantry')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .limit(1)
        .maybeSingle();

      if (selectError) throw selectError;
      if (!item) return;

      const { error } = await supabase
        .from('user_pantry')
        .delete()
        .eq('user_id', user.id)
        .eq('id', item.id);

      if (error) throw error;

      pantry.value = pantry.value.filter((pantryItem) => pantryItem.id !== item.id);
    },
    { id: (recipeId) => recipeId, toast: true }
  );

  /**
   * Delete the pantry of the current user
   */
  const deletePantry = trackAction('deletePantry', async (): Promise<void> => {
    const user = await requireUser();

    if (!(await usesPantry())) return;

    const { error } = await supabase.from('user_pantry').delete().eq('user_id', user.id);

    if (error) throw error;

    pantry.value = [];
  });

  /**
   * Clear the pantry, for example after logging out
   */
  function clearPantry(): void {
    pantry.value = [];
    clearErrors();
  }

  return {
    isLoading,
    isLoadingAction,
    errorFor,
    clearError,
    pantry,
    getPantry,
    setPantry,
    deletePantryRecipe,
    deletePantry,
    clearPantry
  };
});
