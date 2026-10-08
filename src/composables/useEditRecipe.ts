import i18n from '@/i18n';
import { computed, type Ref, ref, toRaw, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import {
  emptyIngredient,
  emptyInstruction,
  emptyRecipe,
  type Ingredient,
  type Instruction,
  type Recipe
} from '@/utils/types/recipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import router from '@/router';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';
import { validateRecipe, type RecipeErrors } from '@/utils/recipe/validateRecipe';
import { focusField } from '@/utils/global/focusField';

/**
 * Edit recipe composable
 */
export function useEditRecipe(): {
  recipe: Ref<Recipe>;
  image: Ref<File | string | null>;
  fieldErrors: Ref<RecipeErrors>;
  saveRecipe: () => Promise<void>;
  loadRecipe: () => Promise<void>;
} {
  const recipeStore = useRecipeStore();
  const recipe = ref<Recipe>(emptyRecipe());
  const originalRecipe = ref<Recipe>(emptyRecipe());
  const image = ref<File | string | null>(null);
  const originalImage = ref<File | string | null>(null);
  const fieldErrors = ref<RecipeErrors>({});
  const route = useRoute();

  let triedToSave = false;

  /**
   * Get the recipe without the empty rows and with renumbered instructions, as it will be saved
   * @returns The cleaned recipe
   */
  function cleanRecipe(): Recipe {
    const cleanedRecipe = structuredClone(toRaw(recipe.value));

    cleanedRecipe.ingredients = cleanedRecipe.ingredients.filter(
      (ingredient: Ingredient) => ingredient.amount !== 0 && ingredient.unit && ingredient.name
    );
    cleanedRecipe.instructions = cleanedRecipe.instructions
      .filter((instruction: Instruction) => instruction.instruction)
      .map((instruction: Instruction, index: number) => ({
        ...instruction,
        sort_order: index + 1
      }));

    return cleanedRecipe;
  }

  /**
   * Save recipe. Shows every invalid field and focuses the first one instead when the recipe is not
   * complete.
   */
  async function saveRecipe(): Promise<void> {
    if (!hasUnsavedChanges.value) {
      await router.push({
        path: recipe.value.id ? `/recipe/${recipe.value.id}` : '/recipes'
      });
      return;
    }

    const cleanedRecipe = cleanRecipe();

    triedToSave = true;
    fieldErrors.value = validateRecipe(cleanedRecipe);

    const firstInvalidField = Object.keys(fieldErrors.value)[0];

    if (firstInvalidField) {
      await focusField(firstInvalidField);
      return;
    }

    const saved = await recipeStore.setRecipe(
      cleanedRecipe,
      image.value && typeof image.value !== 'string' ? image.value : null
    );

    if (!saved) return;

    recipe.value.id = recipeStore.recipe.id;
    originalRecipe.value = structuredClone(toRaw(recipe.value));
    originalImage.value = image.value;

    await router.push({
      path: `/recipe/${recipeStore.recipe.id}`
    });
  }

  /**
   * Check if the recipe has unsaved changes
   */
  const hasUnsavedChanges = computed(() => {
    const recipeChanged = JSON.stringify(recipe.value) !== JSON.stringify(originalRecipe.value);
    const imageChanged = image.value !== originalImage.value;

    return recipeChanged || imageChanged;
  });

  /**
   * Get the recipe to edit. It starts during setup, so the first render already shows the loader
   */
  async function loadRecipe(): Promise<void> {
    if (!route.params.recipeId) return;

    const loaded = await recipeStore.getRecipe(route.params.recipeId as string);

    if (!loaded) return;

    recipe.value = structuredClone(toRaw(recipeStore.recipe));
    recipe.value.ingredients.push(emptyIngredient());
    recipe.value.instructions.push({
      ...emptyInstruction(),
      sort_order: recipe.value.instructions.length + 1
    });
    originalRecipe.value = structuredClone(toRaw(recipe.value));
    image.value =
      recipeStore.recipeImage !== DEFAULT_RECIPE_IMAGE_SRC ? recipeStore.recipeImage : null;
    originalImage.value = image.value;
  }

  loadRecipe();

  watch(
    recipe,
    () => {
      if (triedToSave) {
        fieldErrors.value = validateRecipe(cleanRecipe());
      }
    },
    { deep: true }
  );

  // Prevent leaving the page if there are unsaved changes
  onBeforeRouteLeave(() => {
    if (hasUnsavedChanges.value) {
      return window.confirm(i18n.global.t('general.errors.unsavedChanges'));
    }

    return true;
  });

  return { recipe, image, fieldErrors, saveRecipe, loadRecipe };
}
