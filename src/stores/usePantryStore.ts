import { defineStore } from 'pinia';
import { useActions } from '@/composables/useActions';
import { computed, ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { requireUser } from '@/utils/global/requireUser';
import { getRecipeImageUrls } from '@/utils/recipe/recipeImages';
import type { PantryItem } from '@/utils/types/pantry';
import type { RecipeSummary } from '@/utils/types/recipe';
import { useProfileStore } from './useProfileStore';
import { useUserStore } from './useUserStore';

const PANTRY_SELECT = '*, recipes(*, recipe_users(user_id, last_eaten))';

export const usePantryStore = defineStore('pantry', () => {
  const { isLoading, isLoadingAction, errorFor, clearError, clearErrors, trackAction } = useActions<
    'getPantry' | 'setPantry' | 'deletePantryRecipe' | 'deletePantry'
  >();

  const profileStore = useProfileStore();
  const userStore = useUserStore();

  const pantry = ref<PantryItem[]>([]);
  const recipeImages = ref<Record<string, string>>({});

  /**
   * The recipes in the pantry, in the shape the recipe cards use. A recipe that was added more than
   * once is shown once for every time it was added, with the id of the pantry item as key. Recipes
   * that were deleted or can no longer be accessed are left out.
   */
  const recipes = computed<(RecipeSummary & { key: string })[]>(() =>
    pantry.value.flatMap(({ id, recipes: recipe }) => {
      if (!recipe) return [];

      const { recipe_users: recipeUsers, ...details } = recipe;
      const lastEaten = recipeUsers.find((recipeUser) => recipeUser.user_id === userStore.user?.id);

      return [
        {
          ...details,
          key: id,
          notes: details.notes ?? '',
          last_eaten: lastEaten?.last_eaten ?? ''
        }
      ];
    })
  );

  /**
   * Get signed image URLs for the recipes in the pantry that do not have one yet. A failure is not
   * shown, because the cards fall back to the default image.
   */
  async function getRecipeImages(): Promise<void> {
    const missingIds = [...new Set(recipes.value.map((recipe) => recipe.id))].filter(
      (id) => !(id in recipeImages.value)
    );

    const images = await getRecipeImageUrls(missingIds);

    if (images) recipeImages.value = { ...recipeImages.value, ...images };
  }

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
      .select(PANTRY_SELECT)
      .eq('user_id', user.id);

    if (error) throw error;

    pantry.value = data ?? [];
    recipeImages.value = {};

    await getRecipeImages();
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
        .select(PANTRY_SELECT);

      if (error) throw error;

      pantry.value.push(...(data ?? []));

      await getRecipeImages();
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
   * Update the last eaten date of a recipe in the pantry, after it was saved elsewhere, so every card
   * of that recipe shows the new date without loading the pantry again
   * @param recipeId Id of the recipe that was eaten
   * @param date Date as `YYYY-MM-DD`
   */
  function updateLastEaten(recipeId: string, date: string): void {
    for (const { recipes: recipe } of pantry.value) {
      if (recipe?.id !== recipeId) continue;

      for (const recipeUser of recipe.recipe_users) {
        if (recipeUser.user_id === userStore.user?.id) recipeUser.last_eaten = date;
      }
    }
  }

  /**
   * Clear the pantry, for example after logging out
   */
  function clearPantry(): void {
    pantry.value = [];
    recipeImages.value = {};
    clearErrors();
  }

  return {
    isLoading,
    isLoadingAction,
    errorFor,
    clearError,
    pantry,
    recipes,
    recipeImages,
    getPantry,
    setPantry,
    deletePantryRecipe,
    deletePantry,
    updateLastEaten,
    clearPantry
  };
});
