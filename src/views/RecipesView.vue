<template>
  <main class="recipes">
    <article class="header">
      <h2>{{ $t('recipesPage.title') }}</h2>
      <div class="filters">
        <button @click="openFilter = !openFilter" type="button">
          <font-awesome-icon :icon="['fas', 'filter']" />{{ $t('recipesPage.filter') }}
        </button>
        <select-field
          id="order"
          :ariaLabel="$t('recipesPage.ariaLabel.order')"
          :placeholder="$t('recipesPage.order')"
          :required="false"
          :items="
            Object.values(OrderCategories).map((category) => ({
              value: category,
              label: category
            }))
          "
          labelPrefix="recipesPage.orders."
          v-model:selected="order"
        />
      </div>
    </article>
    <template v-for="recipe in recipes" :key="recipe.id">
      <article class="card" :id="recipe.id" @click="$router.push({ path: `/recipe/${recipe.id}` })">
        <div class="title">
          <h3>{{ recipe.name }}</h3>
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
        </div>
      </article>
    </template>
  </main>
</template>

<script setup lang="ts">
import { getData } from '@/utils/db';
import { getImage } from '@/utils/newRecipe/manageImage';
import type { Recipe } from '@/utils/types/recipe';
import { ref, watch } from 'vue';
import { capitalizeFirstLetter } from '@/utils/text';
import SelectField from '@/components/form/SelectField.vue';
import { OrderCategories } from '@/utils/types/order';
import { orderBy, QueryConstraint } from 'firebase/firestore';

const recipes = ref<Recipe[]>([]);
const order = ref<string>('lastEatenAsc');

// Get recipes
watch(
  order,
  async () => {
    try {
      recipes.value = (await getData('recipes', getQuery())) as Recipe[];
      recipes.value.forEach((recipe) => {
        setImage(recipe.id, recipe.image);
      });
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

/**
 * Get the query constraint for the recipes
 * @returns QueryConstraint
 */
function getQuery(): QueryConstraint {
  switch (order.value) {
    case OrderCategories.lastEatenAsc:
      return orderBy('lastEaten', 'asc');
    case OrderCategories.lastEatenDesc:
      return orderBy('lastEaten', 'desc');
    case OrderCategories.ratingAsc:
      return orderBy('rating', 'asc');
    case OrderCategories.ratingDesc:
      return orderBy('rating', 'desc');
    case OrderCategories.nameAsc:
      return orderBy('name', 'asc');
    case OrderCategories.nameDesc:
      return orderBy('name', 'desc');
    default:
      return orderBy('lastEaten', 'asc');
  }
}

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

// Toggle filter
const openFilter = ref<boolean>(false);
</script>
