import i18n from '@/i18n';
import { getAuth } from 'firebase/auth';
import { onMounted, ref, watch, type Ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import router from '@/router';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { useRecipeStore } from '@/stores/useRecipeStore';

/**
 * Composable for editing a recipe
 * @returns {Object} An object containing the recipe, image, error message, and a function to save the recipe
 */
export function useEditRecipe(): {
  recipe: Ref<Recipe>;
  image: Ref<File | null>;
  errorMessage: Ref<string>;
  save: Ref<boolean>;
} {
  const recipeStore = useRecipeStore();
  const route = useRoute();

  const oldRecipe = ref<Recipe>(emptyRecipe());
  const recipe = ref<Recipe>(emptyRecipe());
  let oldImage: string = '';
  const image = ref<File | null>(null);
  const save = ref<boolean>(false);
  const errorMessage = ref<string>('');

  // Clear recipe when creating a new recipe
  onMounted(() => {
    if (!route.params.recipeId) {
      recipeStore.clearRecipe();
    }
  });

  // Save the recipe when the save variable changes to true
  watch(save, (newValue) => {
    if (newValue) {
      saveRecipe().then(() => {
        save.value = false;
      });
    }
  });

  /**
   * Save the recipe
   * @returns {Promise<void>} A promise that resolves when the recipe is saved
   */
  async function saveRecipe(): Promise<void> {
    errorMessage.value = validateRecipe(recipe.value);
    if (errorMessage.value === '') {
      // Clean up the recipe
      recipe.value.name = recipe.value.name.toLowerCase();
      recipe.value.ingredients = recipe.value.ingredients.filter(
        (ingredient) => ingredient.amount !== 0 && ingredient.unit !== '' && ingredient.name !== ''
      );
      recipe.value.ingredients = recipe.value.ingredients.map((ingredient) => ({
        amount: ingredient.amount,
        unit: ingredient.unit,
        name: ingredient.name.toLowerCase()
      }));
      recipe.value.instructions = recipe.value.instructions.filter(
        (instruction) => instruction !== ''
      );
      recipe.value.instructions = recipe.value.instructions.map((instruction) =>
        instruction.toLowerCase()
      );
      recipe.value.filterIngredients = recipe.value.ingredients.map(
        (ingredient) => ingredient.name
      );

      // Save the recipe
      if (JSON.stringify(oldRecipe.value) == JSON.stringify(emptyRecipe())) {
        // Adding a new recipe
        recipe.value.id = crypto.randomUUID();
        recipe.value.owner = getAuth().currentUser?.uid || '';
        recipe.value.image = image.value ? image.value.name : '';

        recipeStore
          .saveRecipe(recipe.value, image.value!)
          .then(() => {
            // Reset the form
            recipe.value = emptyRecipe();
            oldRecipe.value = emptyRecipe();
            image.value = null;
            oldImage = '';
            errorMessage.value = '';

            router.push({
              path: `/recipe/${route.params.recipeId || recipe.value.id}`
            });
          })
          .catch((error) => {
            console.error('Error saving recipe:', error);
            errorMessage.value = i18n.global.t('editRecipePage.errors.save');
          });
      } else {
        // Updating an existing recipe
        if (image.value && image.value.name !== oldImage) {
          recipe.value.image = image.value.name;
        }

        recipeStore
          .updateRecipe(recipe.value, image.value!, oldImage)
          .then(() => {
            // Reset the form
            recipe.value = emptyRecipe();
            oldRecipe.value = emptyRecipe();
            image.value = null;
            oldImage = '';
            errorMessage.value = '';

            router.push({
              path: `/recipe/${route.params.recipeId || recipe.value.id}`
            });
          })
          .catch((error) => {
            console.error('Error saving recipe:', error);
            errorMessage.value = i18n.global.t('editRecipePage.errors.save');
          });
      }
    }
  }

  // Prevent leaving the page if there are unsaved changes
  onBeforeRouteLeave(() => {
    if (
      (JSON.stringify(oldRecipe.value) !== JSON.stringify(emptyRecipe()) &&
        recipe.value !== oldRecipe.value) ||
      JSON.stringify(recipe.value) !== JSON.stringify(emptyRecipe())
    ) {
      const answer = window.confirm(i18n.global.t('editRecipePage.errors.unsavedChanges'));
      if (!answer) return false;
    }
  });

  return { recipe, image, errorMessage, save };
}
