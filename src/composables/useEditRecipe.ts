import i18n from '@/i18n';
import { computed, Ref, ref, toRaw} from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { emptyRecipe, Ingredient, Instruction, type Recipe } from '@/utils/types/recipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import router from '@/router';

/**
 * Edit recipe composable
 */
export function useEditRecipe(): {
  recipe: Ref<Recipe>,
  image: Ref<File | null>,
  saveRecipe: () => Promise<void>;
} {
  const recipeStore = useRecipeStore();
  const recipe = ref<Recipe>(emptyRecipe());
  const originalRecipe = ref<Recipe>(emptyRecipe());
  const image = ref<File | null>(null);
  const originalImage = ref<File | null>(null);

  /**
   * Save recipe
   * @param recipe Recipe to save
   * @param image Recipe image
   */
  async function saveRecipe(): Promise<void> {
    const cleanedRecipe = structuredClone(toRaw(recipe.value));

    cleanedRecipe.ingredients = cleanedRecipe.ingredients.filter(
      (ingredient: Ingredient) => ingredient.amount !== 0 && ingredient.unit && ingredient.name
    );
    cleanedRecipe.instructions = cleanedRecipe.instructions.filter(
      (instruction: Instruction) => instruction.instruction
    ).map((instruction: Instruction, index: number) => ({
      ...instruction,
      sort_order: index + 1
    }));

    recipeStore
      .setRecipe(cleanedRecipe, image.value ? image.value : null)
      .then(() => {
        if (!recipeStore.errorMessage) {
          router.push({
            path: `/recipe/${recipeStore.recipe.id}`
          });
        }
      })
  }

  /**
   * Check if the recipe has unsaved changes
   */

  const hasUnsavedChanges = computed(() => {
    const recipeChanged = JSON.stringify(recipe.value) !== JSON.stringify(originalRecipe.value);
    const imageChanged = image.value !== originalImage.value;

    return recipeChanged || imageChanged;
  });

  // Prevent leaving the page if there are unsaved changes
  onBeforeRouteLeave(() => {
    if (hasUnsavedChanges.value) {
      return window.confirm(i18n.global.t('errors.unsavedChanges'));
    }

    return true;
  });

  return { recipe, image, saveRecipe };
}
