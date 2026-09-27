<template>
  <TransitionGroup name="move" tag="div" class="grid">
    <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Recipe } from '@/utils/types/recipe';
import RecipeCard from './RecipeCard.vue';

defineProps<{ recipes: Recipe[] }>();
</script>
