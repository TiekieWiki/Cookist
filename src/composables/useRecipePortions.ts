import { ref, watch, type Ref } from 'vue';
import { Ingredient } from '@/utils/types/recipe';
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { useRecipeStore } from '@/stores/useRecipeStore';

/**
 * Composable to manage recipe portion state.
 * @returns An object containing the portioned recipe state and related functions.
 */
export function useRecipePortions(): {
  portionCount: Ref<number>;
  portionedIngredients: Ref<Ingredient[]>;
  changeIngredientUnit: () => void;
} {
  const recipeStore = useRecipeStore();
  const portionCount = ref<number>(recipeStore.recipe.portions || 1);
  const portionedIngredients = ref<Ingredient[]>(recipeStore.recipe.ingredients);
  
  // Update ingredient amount and unit
  watch(
    () => portionCount.value,
    () => {
      changeIngredientUnit();
    }
  );

  /**
   * Update the ingredient unit
   */
  function changeIngredientUnit(): void {
    portionedIngredients.value = updateIngredientUnit(
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
