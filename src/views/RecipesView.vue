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
      <RecipeOrderFilter v-model:open-filters="openFilters" />
      <div class="filtersRecipes">
        <RecipesFilter v-model:open-filters="openFilters" v-model:filter="filter" />
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
import { Filter } from '@/utils/types/orderFilter';
import { ref } from 'vue';
import i18n from '@/i18n/index.js';
import { RecipeCategories } from '@/utils/types/recipe.js';
import RecipesFilter from '@/components/recipes/RecipesFilter.vue';

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
