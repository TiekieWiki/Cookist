<template>
  <main class="recipe two-columns">
    <article>
      <div class="header">
        <h2>{{ recipe.name }}</h2>
        <div>
          <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
          <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
        </div>
      </div>
      <div class="info">
        <p>{{ capitalizeFirstLetter(recipe.category) }}</p>
        |
        <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}</p>
        |
        <p>
          <font-awesome-icon :icon="['fas', 'utensils']" />

          {{ recipe.portions }}
        </p>
        |
        <p>
          <font-awesome-icon :icon="['far', 'calendar']" />
          {{ recipe.lastEaten!.toDate().toLocaleDateString() }}
        </p>
      </div>
      <p v-if="recipe.notes">{{ recipe.notes }}</p>
    </article>
    <article>
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="label-group">
        <label v-for="ingredient in recipe.ingredients" :key="ingredient.name">
          <input :name="ingredient.name" type="checkbox" />
          {{ ingredient.amount }} {{ $t(`addRecipePage.units.${ingredient.unit}`) }}
          {{ ingredient.name }}
        </label>
      </div>
    </article>
    <article>
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="label-group">
        <label v-for="instruction in recipe.instructions" :key="instruction">
          <input :name="instruction" type="checkbox" />
          {{ instruction }}
        </label>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { getData } from '@/utils/db';
import type { Recipe } from '@/utils/types/recipe';
import { where } from 'firebase/firestore';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { capitalizeFirstLetter } from '@/utils/text';
import { getImage } from '@/utils/newRecipe/manageImage';
import i18n from '@/i18n';

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
  notes: '',
  filterIngredients: []
});

watch(
  () => route.params.id,
  async (id) => {
    try {
      const recipes = await getData('recipes', where('id', '==', id));
      if (recipes.length > 0) {
        recipe.value = recipes[0] as Recipe;
      }
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

// Set the recipe image
onMounted(() => {
  getImage(recipe.value.image).then((url) => {
    const img = document.querySelector('.banner')?.querySelector('img');
    if (img) {
      img.src = url;
      img.alt = recipe.value.name;
    }
  });
});

// Remove the image when the component is unmounted
onUnmounted(() => {
  const img = document.querySelector('.banner')?.querySelector('img');
  if (img) {
    img.src = '/src/assets/images/Banner.jpg';
    img.alt = i18n.global.t('alt.banner');
  }
});
</script>
