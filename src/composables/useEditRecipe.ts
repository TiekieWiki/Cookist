import i18n from '@/i18n';
import { ref} from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { emptyRecipe, Ingredient, Instruction, type Recipe } from '@/utils/types/recipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import router from '@/router';

/**
 * Edit recipe composable
 */
export function useEditRecipe(): {
  saveRecipe: (recipe: Recipe, image: File | null) => Promise<void>;
} {
  const recipeStore = useRecipeStore();
  const oldRecipe = ref<Recipe>(emptyRecipe());

  /**
   * Save recipe
   * @param recipe Recipe to save
   * @param image Recipe image
   */
  async function saveRecipe(recipe: Recipe, image: File | null): Promise<void> {
    const cleanedRecipe = JSON.parse(JSON.stringify(recipe));

    cleanedRecipe.ingredients = cleanedRecipe.ingredients.filter(
      (ingredient: Ingredient) => ingredient.amount !== 0 && ingredient.unit && ingredient.name
    );
    cleanedRecipe.instructions = cleanedRecipe.instructions.filter(
      (instruction: Instruction) => instruction.instruction
    );

    recipeStore
      .setRecipe(cleanedRecipe, image ? image : null)
      .then(() => {
        if (!recipeStore.errorMessage) {
          router.push({
            path: `/recipe/${recipeStore.recipe.id}`
          });
        }
      })
  }

  // Prevent leaving the page if there are unsaved changes
  onBeforeRouteLeave(() => {
    if (
      (JSON.stringify(oldRecipe.value) !== JSON.stringify(emptyRecipe()) &&
        recipeStore.recipe !== oldRecipe.value) ||
      JSON.stringify(recipeStore.recipe) !== JSON.stringify(emptyRecipe())
    ) {
      const answer = window.confirm(i18n.global.t('errors.unsavedChanges'));
      if (!answer) return false;
    }
  });

  return { saveRecipe };
}
