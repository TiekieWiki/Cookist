import i18n from '@/i18n';
import { computed, onMounted, Ref, ref, toRaw} from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { emptyIngredient, emptyInstruction, emptyRecipe, Ingredient, Instruction, type Recipe } from '@/utils/types/recipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import router from '@/router';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';

/**
 * Edit recipe composable
 */
export function useEditRecipe(): {
  recipe: Ref<Recipe>,
  image: Ref<File | string | null>,
  saveRecipe: () => Promise<void>;
} {
  const recipeStore = useRecipeStore();
  const recipe = ref<Recipe>(emptyRecipe());
  const originalRecipe = ref<Recipe>(emptyRecipe());
  const image = ref<File | string | null>(null);
  const originalImage = ref<File | string | null>(null);
  const route = useRoute();

  /**
   * Save recipe
   * @param recipe Recipe to save
   * @param image Recipe image
   */
  async function saveRecipe(): Promise<void> {
    if (!hasUnsavedChanges) router.push({
      path: `/recipe/${recipeStore.recipe.id}`
    });

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
      .setRecipe(cleanedRecipe, image.value && typeof image.value !== "string" ? image.value : null)
      .then(() => {
        if (!recipeStore.errorMessage) {
          originalRecipe.value = recipe.value;
          originalImage.value = image.value;

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

  // Get recipe on mount
  onMounted(async () => {
    if (route.params.recipeId) {
      await recipeStore.getRecipe(route.params.recipeId as string);
      recipe.value = recipeStore.recipe;
      recipe.value.ingredients.push(emptyIngredient());
      recipe.value.instructions.push({
        ...emptyInstruction(),
        sort_order: recipe.value.instructions.length + 1
      });
      originalRecipe.value = recipe.value;
      image.value =
        recipeStore.recipeImage !== DEFAULT_RECIPE_IMAGE_SRC
          ? recipeStore.recipeImage
          : null;
      originalImage.value = image.value;
    }
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
