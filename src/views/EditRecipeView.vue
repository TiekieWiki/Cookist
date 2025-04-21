<template>
  <main class="editRecipe">
    <article>
      <h2>{{ $t('editRecipePage.title') }}</h2>
      <form>
        <new-recipe
          v-model:recipe="recipe"
          v-model:cookGroupRecipe="cookGroupRecipe"
          v-model:image="image"
          v-model:errorMessage="errorMessage"
        />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('editRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/NewRecipe.vue';
import i18n from '@/i18n/index';
import { getData, updateData } from '@/utils/db';
import { deleteImage, uploadImage } from '@/utils/newRecipe/manageImage';
import { validateRecipe } from '@/utils/newRecipe/validateRecipe';
import { capitalizeFirstLetter } from '@/utils/text';
import { emptyCookGroupRecipes, type CookGroupRecipes } from '@/utils/types/cookgroup';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { where } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

// Get the recipe from the database
const route = useRoute();
const oldRecipe = ref<Recipe>(emptyRecipe());
const recipe = ref<Recipe>(emptyRecipe());
const oldImage = ref<string>('');
const cookGroupRecipe = ref<CookGroupRecipes>(emptyCookGroupRecipes());

watch(
  () => route.params.id,
  async (id) => {
    try {
      const recipes = await getData('recipes', where('id', '==', id));
      const cookGroupRecipes = await getData('cookGroupRecipes', where('recipeId', '==', id));
      if (recipes.length > 0 && cookGroupRecipes.length > 0) {
        recipe.value = recipes[0] as Recipe;
        recipe.value.name = capitalizeFirstLetter(recipe.value.name);
        oldRecipe.value = recipes[0] as Recipe;
        oldImage.value = recipe.value.image;
        cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipes;
        console.log(cookGroupRecipe.value);
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
 * Save the new recipe
 */
async function saveRecipe() {
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
    if (image.value && image.value.name !== oldImage.value) {
      recipe.value.image = image.value.name;
    }

    // Save the recipe
    try {
      await updateData('recipes', where('id', '==', recipe.value.id), recipe.value);
      await updateData(
        'cookGroupRecipes',
        where('recipeId', '==', recipe.value.id),
        cookGroupRecipe.value
      );

      //Save image
      if (image.value && image.value.name !== oldImage.value) {
        uploadImage(image.value);
        deleteImage(oldImage.value);
      }
    } catch (error) {
      errorMessage.value = i18n.global.t('editRecipePage.errors.save');
    }
  }
}

// Prevent leaving the page if there are unsaved changes
onBeforeRouteLeave(() => {
  if (recipe.value !== oldRecipe.value) {
    const answer = window.confirm(i18n.global.t('editRecipePage.errors.unsavedChanges'));
    if (!answer) return false;
  }
});
</script>
