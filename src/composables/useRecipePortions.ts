import { ref, toRaw, watch, type Ref } from 'vue';
import { type Ingredient } from '@/utils/types/recipe';
import { updateIngredientsUnit } from '@/utils/recipe/updateIngredientUnit';
import { useRecipeStore } from '@/stores/useRecipeStore';

/**
 * Composable to manage recipe portion state.
 * @returns An object containing the portioned recipe state and related functions.
 */
export function useRecipePortions(): {
  portionCount: Ref<number>;
  portionedIngredients: Ref<Ingredient[]>;
  changeIngredientUnit: (index: number, unit: string) => void;
} {
  const recipeStore = useRecipeStore();
  const portionCount = ref<number>(1);
  const portionedIngredients = ref<Ingredient[]>([]);

  // Reset portions and ingredients whenever another recipe is loaded
  watch(
    () => recipeStore.recipe,
    (recipe) => {
      portionCount.value = recipe.portions || 1;
      portionedIngredients.value = structuredClone(toRaw(recipe.ingredients));
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
   * Update the unit of an ingredient
   * @param index Index of the ingredient to update
   * @param unit New unit of the ingredient
   */
  function changeIngredientUnit(index: number, unit: string): void {
    portionedIngredients.value[index].unit = unit;
    updateIngredients();
  }

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
    portionedIngredients,
    changeIngredientUnit
  };
}
