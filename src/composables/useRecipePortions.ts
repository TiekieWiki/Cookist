import { ref, toRaw, watch, type Ref } from 'vue';
import { type Ingredient } from '@/utils/types/recipe';
import { getPreferredUnit, updateIngredientsUnit } from '@/utils/recipe/updateIngredientUnit';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useProfileStore } from '@/stores/useProfileStore';

/**
 * Composable to manage recipe portion state.
 * @returns An object containing the portioned recipe state and related functions.
 */
export function useRecipePortions(): {
  portionCount: Ref<number>;
  portionedIngredients: Ref<Ingredient[]>;
} {
  const recipeStore = useRecipeStore();
  const profileStore = useProfileStore();
  const portionCount = ref<number>(1);
  const portionedIngredients = ref<Ingredient[]>([]);

  // Reset portions and ingredients whenever another recipe is loaded
  watch(
    [() => recipeStore.recipe, () => profileStore.profile?.measuring_system],
    ([recipe, measuringSystem]) => {
      portionCount.value = recipe.portions || 1;
      portionedIngredients.value = recipe.ingredients.map((ingredient) => ({
        ...structuredClone(toRaw(ingredient)),
        unit: measuringSystem ? getPreferredUnit(ingredient, measuringSystem) : ingredient.unit
      }));
      updateIngredients();
    },
    { immediate: true }
  );

  // Update ingredient amount and unit
  watch(
    () => portionCount.value,
    () => {
      updateIngredients();
    }
  );

  /**
   * Recalculate the ingredient amounts based on their units and the portion count
   */
  function updateIngredients(): void {
    portionedIngredients.value = updateIngredientsUnit(
      recipeStore.recipe.ingredients,
      portionedIngredients.value,
      recipeStore.recipe.portions,
      portionCount.value
    );
  }

  return {
    portionCount,
    portionedIngredients
  };
}
