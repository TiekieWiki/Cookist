<template>
  <main class="recipes">
    <article>
      <h2>{{ $t('recipesPage.title') }}</h2>
    </article>
    <template v-for="recipe in recipes" :key="recipe.id">
      <article class="card" :id="recipe.id" @click="$router.push({ path: `/recipe/${recipe.id}` })">
        <div class="title">
          <h3>{{ recipe.name }}</h3>
          <div>
            <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
            <font-awesome-icon v-for="n in 5 - recipe.rating" :icon="['far', 'star']" :key="n" />
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
        </div>
      </article>
    </template>
  </main>
</template>

<script setup lang="ts">
import { getData } from '@/utils/db';
import { getImage } from '@/utils/newRecipe/manageImage';
import type { Recipe } from '@/utils/types/recipe';
import { onMounted, ref } from 'vue';
import { capitalizeFirstLetter } from '@/utils/text';

const recipes = ref<Recipe[]>([]);

// Get the recipes from the database
onMounted(async () => {
  try {
    const data = await getData('recipes');
    recipes.value = data as Recipe[];

    // Set the image to the recipe
    recipes.value.forEach((recipe) => {
      setImage(recipe.id, recipe.image);
    });
  } catch (error) {
    console.error(error);
  }
});

/**
 * Set the image to the recipe
 * @param id Recipe ID
 * @param image Image name
 */
function setImage(id: string, image: string) {
  getImage(image).then((url) => {
    const article = document.getElementById(id);
    if (article) {
      article.style.backgroundImage = `url(${url})`;
    }
  });
}
</script>
