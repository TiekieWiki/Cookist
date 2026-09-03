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
      <RecipesCard :recipes="recipesStore.recipes" />
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeOrderFilter from '@/components/recipes/RecipeOrderFilter.vue';
import RecipesCard from '@/components/recipes/RecipesCard.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const recipesStore = useRecipesStore();

onMounted(() => {
  recipesStore.getRecipes();
});
</script>
