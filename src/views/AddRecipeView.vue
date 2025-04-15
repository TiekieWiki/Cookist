<template>
  <main class="addRecipe">
    <article>
      <h2>{{ $t('addRecipePage.title') }}</h2>
      <form>
        <new-recipe
          v-model:recipe="recipe"
          v-model:image="image"
          v-model:errorMessage="errorMessage"
        />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('addRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';
import i18n from '@/i18n/index';
import { addData } from '@/utils/db';
import { uploadImage } from '@/utils/newRecipe/manageImage';
import { validateRecipe } from '@/utils/newRecipe/validateRecipe';
import NewRecipe from '@/components/NewRecipe.vue';
import { Timestamp } from 'firebase/firestore';
import { onBeforeRouteLeave } from 'vue-router';

const recipe = ref<Recipe>(emptyRecipe());

const image = ref<File | null>(null);

const errorMessage = ref<string>('');

/**
 * Save the new recipe
 */
async function saveRecipe() {
  errorMessage.value = validateRecipe(recipe.value);
  if (errorMessage.value === '') {
    // Clean up the recipe
    recipe.value.id = crypto.randomUUID();
    recipe.value.name = recipe.value.name.toLowerCase();
    recipe.value.image = image.value ? image.value.name : '';
    recipe.value.lastEaten = Timestamp.fromDate(new Date());
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

    // Save the recipe
    try {
      await addData('recipes', recipe.value);

      //Save image
      if (image.value) {
        uploadImage(image.value);
      }

      // Reset the form
      recipe.value = emptyRecipe();
      image.value = null;
      errorMessage.value = '';
    } catch (error) {
      errorMessage.value = i18n.global.t('addRecipePage.errors.save');
    }
  }
}

// Prevent leaving the page if there are unsaved changes
onBeforeRouteLeave(() => {
  if (recipe.value !== emptyRecipe()) {
    const answer = window.confirm(i18n.global.t('addRecipePage.errors.unsavedChanges'));
    if (!answer) return false;
  }
});
</script>
