<template>
  <main class="addRecipe">
    <article>
      <h2>{{ $t('editRecipePage.title') }}</h2>
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
import NewRecipe from '@/components/NewRecipe.vue';
import i18n from '@/i18n';
import { getData, updateData } from '@/utils/db';
import { deleteImage, uploadImage } from '@/utils/newRecipe/manageImage';
import { validateRecipe } from '@/utils/newRecipe/validateRecipe';
import type { Recipe } from '@/utils/types/recipe';
import { where } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Get the recipe from the database
const route = useRoute();
const recipe = ref<Recipe>({
  id: '',
  name: '',
  category: '',
  duration: undefined,
  portions: undefined,
  rating: undefined,
  image: '',
  ingredients: [{ amount: 0, unit: '', name: '' }],
  instructions: [''],
  lastEaten: undefined,
  notes: ''
});
const oldImage = ref<string>('');

watch(
  () => route.params.id,
  async (id) => {
    const recipes = await getData('recipes', where('id', '==', id));
    if (recipes.length > 0) {
      recipe.value = recipes[0] as Recipe;
      oldImage.value = recipe.value.image;
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
    recipe.value.ingredients = recipe.value.ingredients.filter(
      (ingredient) => ingredient.amount !== 0 && ingredient.unit !== '' && ingredient.name !== ''
    );
    recipe.value.instructions = recipe.value.instructions.filter(
      (instruction) => instruction !== ''
    );

    // Save the recipe
    try {
      await updateData('recipes', where('id', '==', recipe.value.id), recipe.value);

      //Save image
      if (image.value && image.value.name !== oldImage.value) {
        uploadImage(image.value);
        deleteImage(oldImage.value);
      }
    } catch (error) {
      errorMessage.value = i18n.global.t('addRecipePage.errors.save');
    }
  }
}
</script>
