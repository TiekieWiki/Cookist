<template>
  <main class="recipes">
    <article>
      <section class="title">
        <div>
          <h2>{{ $t('recipesPage.title') }}</h2>
          <p>{{ $t('recipesPage.totalRecipes', { count: recipesStore.recipes.length }) }}</p>
        </div>
        <router-link to="/create-recipe" tabindex="-1">
          <Button :type="ButtonType.BUTTON" :size="Size.LARGE">
            <font-awesome-icon :icon="['fas', 'plus']" />
            {{ $t('recipesPage.newRecipe') }}</Button
          ></router-link
        >
      </section>
      <RecipeSearchOrder
        v-model:open-filters="openFilters"
        v-model:filter="recipesStore.filter"
        v-model:order="recipesStore.order"
      />
      <div class="filtersRecipes">
        <RecipesFilter
          v-model:open-filters="openFilters"
          v-model:filter="recipesStore.filter"
          @reset="recipesStore.resetFilter"
        />
        <section class="recipesList">
          <ErrorMessage v-model:message="recipesStore.errorMessage" />
          <Transition name="fade" mode="out-in">
            <EmptyState
              v-if="recipesStore.recipes.length <= 0"
              key="empty"
              icon="wine-glass-empty"
              title="recipesPage.noRecipes"
              subtitle="recipesPage.noRecipesSubtitle"
              button-text="recipesPage.newRecipe"
              button-icon="plus"
              button-route="/create-recipe"
            />
            <RecipeGrid v-else key="list" :recipes="recipesStore.recipes" />
          </Transition>
        </section>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeSearchOrder from '@/components/pages/recipes/RecipeSearchOrder.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import RecipeGrid from '@/components/pages/recipes/RecipeGrid.vue';
import { onMounted, ref } from 'vue';
import RecipesFilter from '@/components/pages/recipes/RecipesFilter.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';

const recipesStore = useRecipesStore();
const openFilters = ref<boolean>(false);

onMounted(() => {
  recipesStore.getRecipes();
});
</script>
