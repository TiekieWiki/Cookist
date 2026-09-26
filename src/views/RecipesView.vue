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
            <TransitionGroup v-else key="list" name="move" tag="div" class="grid">
              <router-link
                v-for="recipe in recipesStore.recipes"
                :key="recipe.id"
                :id="recipe.id"
                :to="`/recipe/${recipe.id}`"
                tabindex="0"
              >
                <RecipeCard :recipe="recipe" />
              </router-link>
            </TransitionGroup>
          </Transition>
        </section>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeSearchOrder from '@/components/recipes/RecipeSearchOrder.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { onMounted } from 'vue';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import { ref } from 'vue';
import RecipesFilter from '@/components/recipes/RecipesFilter.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';

const recipesStore = useRecipesStore();
const openFilters = ref<boolean>(false);

onMounted(() => {
  recipesStore.getRecipes();
});
</script>
