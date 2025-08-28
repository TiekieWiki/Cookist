import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSecureRecipe } from './useSecurity';
import { getRecipeLastEaten } from '@/utils/recipe/lastEaten';
import { emptyCookGroupRecipe, type CookGroupRecipe } from '@/utils/types/cookgroup';
import type { Recipe } from '@/utils/types/recipe';
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { updateData } from '@/utils/global/db';
import { Timestamp, where } from 'firebase/firestore';

/**
 * Composable to manage recipe state and related functionalities.
 * @returns An object containing the recipe state and related functions.
 */
export function useRecipe(): {
  recipe: Ref<Recipe>;
  cookGroupRecipe: Ref<CookGroupRecipe>;
  initialIngredients: { amount: number; unit: string; name: string }[];
  lastEaten: Ref<string | undefined>;
  lastEatenToday: Ref<boolean>;
  portionCount: Ref<number>;
  updateLastEaten: () => Promise<void>;
} {
  const route = useRoute();

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
  const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());
  let initialIngredients: { amount: number; unit: string; name: string }[] = [];
  const lastEaten = ref<string>();
  const lastEatenToday = ref<boolean>(false);
  const portionCount = ref<number>(1);

  // Get the recipe from the database
  watch(
    [route.params.cookGroupRecipeId],
    async () => {
      // Get the recipe if user has access to it
      useSecureRecipe(route.params.cookGroupRecipeId as string, cookGroupRecipe, recipe)
        .then(async (result) => {
          if (result) {
            // Get the recipe last eaten date
            const lastEatenDate = getRecipeLastEaten(cookGroupRecipe.value as CookGroupRecipe);
            lastEaten.value = lastEatenDate
              ? lastEatenDate.toDate().toLocaleDateString()
              : undefined;
            lastEatenToday.value = lastEatenDate
              ? lastEatenDate.toDate().toLocaleDateString() === new Date().toLocaleDateString()
              : false;

            initialIngredients = recipe.value.ingredients;
            portionCount.value = recipe.value.portions || 1;
          }
        })
        .catch((error) => {
          console.error('Error getting recipe:', error);
        });
    },
    { immediate: true }
  );

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

  /**
   * Update the last eaten date for the recipe
   * @returns {Promise<void>} - A promise that resolves when the last eaten date is updated
   */
  async function updateLastEaten(): Promise<void> {
    cookGroupRecipe.value.lastEaten = Timestamp.fromMillis(Date.now());
    updateData(
      'cookGroupRecipes',
      where('id', '==', cookGroupRecipe.value.id),
      cookGroupRecipe.value
    )
      .then(() => {
        // Update the last eaten date
        lastEaten.value = cookGroupRecipe.value.lastEaten
          ? cookGroupRecipe.value.lastEaten.toDate().toLocaleDateString()
          : undefined;
        lastEatenToday.value = true;
      })
      .catch((error) => {
        console.error('Error updating last eaten date:', error);
      });
  }

  return {
    recipe,
    cookGroupRecipe,
    initialIngredients,
    lastEaten,
    lastEatenToday,
    portionCount,
    updateLastEaten
  };
}
