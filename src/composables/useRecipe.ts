import { ref, watch, type Ref } from 'vue';
import type { Recipe } from '@/utils/types/recipe';
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';

/**
 * Composable to manage recipe state and related functionalities.
 * @returns An object containing the recipe state and related functions.
 */
export function useRecipe(): {
  recipe: Ref<Recipe>;
  initialIngredients: { amount: number; unit: string; name: string }[];
  lastEaten: Ref<string | undefined>;
  lastEatenToday: Ref<boolean>;
  portionCount: Ref<number>;
} {
  const recipe = ref<Recipe>({
    id: '',
    owner: '',
    name: '',
    category: '',
    duration: undefined,
    portions: undefined,
    rating: undefined,
    image: '',
    ingredients: [{ amount: 0, unit: '', name: '' }],
    instructions: [''],
    notes: '',
    filterIngredients: []
  });
  let initialIngredients: { amount: number; unit: string; name: string }[] = [];
  const lastEaten = ref<string>();
  const lastEatenToday = ref<boolean>(false);
  const portionCount = ref<number>(1);

  // Update ingredient amount and unit
  watch(
    () => portionCount.value,
    () => {
      recipe.value.ingredients = updateIngredientUnit(
        initialIngredients,
        recipe.value.ingredients,
        recipe.value.portions,
        portionCount.value
      );
    }
  );

  return {
    recipe,
    initialIngredients,
    lastEaten,
    lastEatenToday,
    portionCount
  };
}
