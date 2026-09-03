<template>
  <main class="recipes">
    <article>
      <section class="title">
        <div>
          <h2>{{ $t('recipesPage.title') }}</h2>
          <p>{{ $t('recipesPage.totalRecipes', { count: recipesStore.recipes.length }) }}</p>
        </div>
        <Button
          @click="
            $router.push({
              path: '/create-recipe'
            })
          "
          :type="ButtonType.BUTTON"
          :size="Size.LARGE"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          {{ $t('recipesPage.newRecipe') }}
        </Button>
      </section>
      <RecipeOrderFilter />
      <section v-if="recipesStore.recipes.length <= 0">
        <h3>{{ $t('recipesPage.noRecipes') }}</h3>
      </section>
      <TransitionGroup v-else name="move">
        <template
          v-for="recipe in recipesStore.recipes"
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
        </template>
      </TransitionGroup>
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeOrderFilter from '@/components/recipes/RecipeOrderFilter.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { onMounted } from 'vue';
import RecipeCard from '@/components/recipes/RecipeCard.vue';

const recipesStore = useRecipesStore();

onMounted(() => {
  recipesStore.getRecipes();
});
</script>
