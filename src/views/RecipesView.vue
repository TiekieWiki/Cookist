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
      <RecipeOrderFilter v-model:open-filters="openFilters" />
      <div class="filtersRecipes">
        <RecipesFilter v-model:open-filters="openFilters" v-model:filter="filter" />
        <section class="recipesList">
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
import RecipeOrderFilter from '@/components/recipes/RecipeOrderFilter.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, Size } from '@/utils/types/enums';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { onMounted } from 'vue';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import { type Filter } from '@/utils/types/orderFilter';
import { ref } from 'vue';
import i18n from '@/i18n/index.js';
import { RecipeCategories } from '@/utils/types/recipe.js';
import RecipesFilter from '@/components/recipes/RecipesFilter.vue';
import EmptyState from '@/components/general/EmptyState.vue';

const recipesStore = useRecipesStore();
const openFilters = ref<boolean>(false);

onMounted(() => {
  recipesStore.getRecipes();
});

const filter = ref<Filter>({
  name: '',
  categories: Object.values(RecipeCategories).map((category) => ({
    id: category,
    name: category,
    label: i18n.global.t(`editRecipePage.categories.${category}`),
    required: false,
    disabled: false,
    autocomplete: 'off',
    checked: false
  })),
  durationMin: 0,
  durationMax: 10080,
  ratingMin: 0,
  ratingMax: 5,
  lastEatenMin: new Date(0).toISOString().slice(0, 10),
  lastEatenMax: new Date('9999-12-31').toISOString().slice(0, 10),
  ingredients: [{ name: '' }]
});
</script>
