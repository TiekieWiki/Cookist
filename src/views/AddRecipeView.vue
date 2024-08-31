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
import { type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';
import i18n from '@/i18n';
import { addData } from '@/utils/db';
import { uploadImage } from '@/utils/newRecipe/manageImage';
import { validateRecipe } from '@/utils/newRecipe/validateRecipe';
import NewRecipe from '@/components/NewRecipe.vue';

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
    recipe.value.image = image.value ? image.value.name : '';
    recipe.value.lastEaten = new Date();
    recipe.value.ingredients = recipe.value.ingredients.filter(
      (ingredient) => ingredient.amount !== 0 && ingredient.unit !== '' && ingredient.name !== ''
    );
    recipe.value.instructions = recipe.value.instructions.filter(
      (instruction) => instruction !== ''
    );

    // Save the recipe
    try {
      await addData('recipes', recipe.value);

      //Save image
      if (image.value) {
        uploadImage(image.value);
      }
    } catch (error) {
      errorMessage.value = i18n.global.t('addRecipePage.errors.save');
    }
  }
}
</script>
