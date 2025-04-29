<template>
  <main class="editRecipe">
    <article>
      <h2>{{ $t('editRecipePage.title') }}</h2>
      <form>
        <new-recipe
          v-model:recipe="recipe"
          v-model:cook-group-recipe="cookGroupRecipe"
          v-model:image="image"
          v-model:error-message="errorMessage"
        />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('editRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/recipe/NewRecipe.vue';
import i18n from '@/i18n/index';
import { addData, getData, updateData } from '@/utils/db';
import { deleteImage, uploadImage } from '@/utils/manageImage';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { capitalizeFirstLetter } from '@/utils/text';
import { emptyCookGroupRecipe, type CookGroupRecipe } from '@/utils/types/cookgroup';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { Timestamp, where } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const auth = getAuth();
const route = useRoute();

// Recipe and cook group recipe
const oldRecipe = ref<Recipe>(emptyRecipe());
const recipe = ref<Recipe>(emptyRecipe());
const oldImage = ref<string>('');
const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());

// Get the recipe from the database
watch(
  () => route.params.id,
  async (id) => {
    // Check if the recipe needs to be edited or added
    if (!id) return;

    // Get the recipe that needs to be edited
    try {
      const recipes = await getData('recipes', where('id', '==', id));
      const cookGroupRecipes = await getData('cookGroupRecipes', where('recipeId', '==', id));

      // Prepare the recipe and cook group recipe for editing
      if (recipes.length > 0 && cookGroupRecipes.length > 0) {
        recipe.value = recipes[0] as Recipe;
        recipe.value.name = capitalizeFirstLetter(recipe.value.name);
        oldRecipe.value = recipes[0] as Recipe;
        oldImage.value = recipe.value.image;
        cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipe;
      }
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

// Set the image to the recipe image
const image = ref<File | null>(null);
const errorMessage = ref<string>('');

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
    recipe.value.filterIngredients = recipe.value.ingredients.map((ingredient) => ingredient.name);

    // Clean or update the recipe
    if (oldRecipe.value == emptyRecipe()) {
      recipe.value.id = crypto.randomUUID();
      recipe.value.owner = auth.currentUser?.uid || '';
      recipe.value.image = image.value ? image.value.name : '';

      // Clean up the cook group recipe
      cookGroupRecipe.value.id = crypto.randomUUID();
      cookGroupRecipe.value.recipeId = recipe.value.id;
      cookGroupRecipe.value.cookGroupId = auth.currentUser?.uid || '';
      cookGroupRecipe.value.lastEaten = new Timestamp(0, 0);
    } else {
      if (image.value && image.value.name !== oldImage.value) {
        recipe.value.image = image.value.name;
      }
    }

    // Save the recipe
    try {
      // Check if the user is editing an existing recipe
      if (oldRecipe.value == emptyRecipe()) {
        await addData('recipes', recipe.value);
        await addData('cookGroupRecipes', cookGroupRecipe.value);

        // Save image
        if (image.value) {
          uploadImage(image.value);
        }
      } else {
        await updateData('recipes', where('id', '==', recipe.value.id), recipe.value);
        await updateData(
          'cookGroupRecipes',
          where('recipeId', '==', recipe.value.id),
          cookGroupRecipe.value
        );

        // Save image
        if (image.value && image.value.name !== oldImage.value) {
          uploadImage(image.value);
          deleteImage(oldImage.value);
        }
      }

      // Reset the form
      recipe.value = emptyRecipe();
      oldRecipe.value = emptyRecipe();
      cookGroupRecipe.value = emptyCookGroupRecipe();
      image.value = null;
      oldImage.value = '';
      errorMessage.value = '';
    } catch (error) {
      console.error(error);
      errorMessage.value = i18n.global.t('editRecipePage.errors.save');
    }
  }
}

// Prevent leaving the page if there are unsaved changes
onBeforeRouteLeave(() => {
  if (
    (oldRecipe.value !== emptyRecipe() && recipe.value !== oldRecipe.value) ||
    recipe.value !== emptyRecipe()
  ) {
    const answer = window.confirm(i18n.global.t('editRecipePage.errors.unsavedChanges'));
    if (!answer) return false;
  }
});
</script>
