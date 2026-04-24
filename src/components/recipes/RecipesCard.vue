<template>
  <article v-if="recipes.length <= 0">
    <h3>{{ $t('recipesPage.noRecipes') }}</h3>
  </article>
  <TransitionGroup v-else name="move">
    <article
      v-for="recipe in recipes"
      :key="recipe.id"
      class="card"
      :id="recipe.id"
      @click="
        $router.push({
          path: `/recipe/${currentCookGroupRecipes.find((group) => group.cookGroupId == selectedCookGroup && group.recipeId == recipe.id)?.id || ''}`
        })
      "
      tabindex="0"
    >
      <RecipeCard
        :recipe="recipe"
        :current-cook-group-recipes="currentCookGroupRecipes"
        :selected-cook-group="selectedCookGroup"
      />
    </article>
  </TransitionGroup>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import { useRecipes } from '@/composables/useRecipes';

const { currentCookGroupRecipes, selectedCookGroup, recipes } = useRecipes();
</script>
