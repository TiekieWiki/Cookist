<template>
  <TransitionGroup name="move" tag="div" class="grid">
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe.key ?? recipe.id"
      :recipe="recipe"
      :image="images[recipe.id] ?? ''"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { RecipeSummary } from '@/utils/types/recipe';
import RecipeCard from './RecipeCard.vue';

defineProps<{ recipes: (RecipeSummary & { key?: string })[]; images: Record<string, string> }>();
</script>
