<template>
  <article v-if="recipes.length <= 0">
    <h3>{{ $t('recipesPage.noRecipes') }}</h3>
  </article>
  <TransitionGroup v-else name="move">
    <article
      v-for="recipe in recipes"
      :key="recipe.id"
      :id="recipe.id"
      @click="
        $router.push({
          path: `/recipe/${recipe.id}`
        })
      "
      tabindex="0"
    >
      <RecipeCard :recipe="recipe" />
    </article>
  </TransitionGroup>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import { Recipe } from '@/utils/types/recipe';

const props = defineProps<{
  recipes: Recipe[];
}>();
</script>
