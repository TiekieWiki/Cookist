<template>
  <main class="recipes two-columns">
    <RecipeOrderFilterCard />
    <RecipesCard />
    <article class="card newCard">
      <button
        @click="
          $router.push({
            path: '/edit-recipe'
          })
        "
        type="button"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeOrderFilterCard from '@/components/recipes/RecipeOrderFilterCard.vue';
import { useRecipes } from '@/composables/useRecipes';
import RecipesCard from '@/components/recipes/RecipesCard.vue';

const { cookGroups, currentCookGroupRecipes, selectedCookGroup, recipes, order, filter } =
  useRecipes();
</script>
