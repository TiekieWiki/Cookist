<template>
  <section class="title">
    <h3>{{ capitalizeFirstLetter(recipe.name) }}</h3>
    <div v-if="currentCookGroupRecipes">
      <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
      <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
    </div>
  </section>
  <section v-if="currentCookGroupRecipes" class="info">
    <p>{{ capitalizeFirstLetter(recipe.category) }}</p>
    |
    <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}</p>
    |
    <p>
      <font-awesome-icon :icon="['fas', 'utensils']" />

      {{ recipe.portions }}
    </p>
    <template v-if="getRecipesLastEaten(recipe, currentCookGroupRecipes, selectedCookGroup ?? '')">
      |
      <p>
        <font-awesome-icon :icon="['fas', 'calendar']" />
        {{ getRecipesLastEaten(recipe, currentCookGroupRecipes, selectedCookGroup ?? '') }}
      </p>
    </template>
  </section>
</template>

<script lang="ts" setup>
import type { Recipe } from '@/utils/types/recipe';
import { getRecipesLastEaten } from '@/utils/recipe/lastEaten';
import type { CookGroupRecipe } from '@/utils/types/cookgroup';
import { capitalizeFirstLetter } from '@/utils/text';

defineProps<{
  recipe: Recipe;
  currentCookGroupRecipes?: CookGroupRecipe[];
  selectedCookGroup?: string | undefined;
}>();
</script>
