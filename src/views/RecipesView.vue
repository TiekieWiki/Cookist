<template>
  <main class="recipes">
    <article>
      <section class="title">
        <div>
          <h2>{{ $t('general.pageTitles.recipes') }}</h2>
          <p>{{ $t('recipesPage.totalRecipes', { count: recipesStore.recipes.length }) }}</p>
        </div>
        <Button :type="ButtonType.BUTTON" :size="Size.LARGE" to="/create-recipe">
          <font-awesome-icon :icon="['fas', 'plus']" />
          {{ $t('recipesPage.newRecipe') }}</Button
        >
      </section>
      <RecipeSearchOrder v-model:open-filters="openFilters" />
      <div class="filtersRecipes">
        <RecipesFilter v-model:open-filters="openFilters" />
        <section class="recipesList">
          <Transition name="fade" mode="out-in">
            <LoadingSpinner
              v-if="recipesStore.isLoadingAction('getRecipes') && !recipesStore.recipes.length"
              key="loading"
            />
            <ErrorState
              v-else-if="recipesError && !recipesStore.recipes.length"
              key="error"
              :error="recipesError"
              @retry="recipesStore.getRecipes()"
            />
            <EmptyState
              v-else-if="recipesStore.recipes.length <= 0"
              key="empty"
              icon="wine-glass-empty"
              title="recipesPage.noRecipes"
              subtitle="recipesPage.noRecipesSubtitle"
              button-text="recipesPage.newRecipe"
              button-icon="plus"
              button-route="/create-recipe"
            />
            <div v-else key="list" class="results">
              <RecipeGrid :recipes="recipesStore.recipes" :images="recipesStore.recipeImages" />
              <Transition name="fade">
                <ErrorState
                  v-if="recipesError"
                  :error="recipesError"
                  @retry="recipesStore.getRecipes()"
                />
              </Transition>
              <div ref="end" aria-hidden="true"></div>
            </div>
          </Transition>
        </section>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import RecipeSearchOrder from '@/components/pages/recipes/RecipeSearchOrder.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import RecipeGrid from '@/components/pages/recipes/RecipeGrid.vue';
import { computed, ref, useTemplateRef, watch } from 'vue';
import RecipesFilter from '@/components/pages/recipes/RecipesFilter.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import ErrorState from '@/components/general/ErrorState.vue';
import { useInView } from '@/composables/useInView';

const recipesStore = useRecipesStore();
const openFilters = ref<boolean>(false);
const isEndInView = useInView(useTemplateRef<HTMLElement>('end'));

const recipesError = computed(() => recipesStore.errorFor('getRecipes'));

const shouldLoadMore = computed(
  () =>
    isEndInView.value &&
    recipesStore.hasMoreRecipes &&
    !recipesStore.isLoadingAction('getRecipes') &&
    !recipesError.value
);

watch(shouldLoadMore, (load) => {
  if (load) recipesStore.loadMoreRecipes();
});

recipesStore.refreshRecipes();
</script>
