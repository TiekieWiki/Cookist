<template>
  <main class="recipes two-columns">
    <article>
      <section class="header">
        <h2>{{ $t('recipesPage.title') }}</h2>
        <select-field
          id="cookGroup"
          :ariaLabel="$t('recipesPage.ariaLabel.cookGroups')"
          :placeholder="$t('recipesPage.placeholder.cookGroups')"
          :required="false"
          :items="
            cookGroups.map((group) => ({
              value: group.id,
              label: capitalizeFirstLetter(group.name)
            }))
          "
          v-model:selected="selectedCookGroup"
        />
      </section>
      <recipe-order-filter v-model:filter="filter" v-model:order="order" />
    </article>
    <article v-if="noRecipes" class="noCards">
      <h3>{{ $t('recipesPage.noRecipes') }}</h3>
    </article>
    <article
      v-else
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
      <recipe-card
        :recipe="recipe"
        :current-cook-group-recipes="currentCookGroupRecipes"
        :selected-cook-group="selectedCookGroup"
      />
    </article>
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
import { getData } from '@/utils/global/db';
import { setImage } from '@/utils/global/manageImage';
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import { onMounted, ref, watch } from 'vue';
import { capitalizeFirstLetter } from '@/utils/global/text';
import SelectField from '@/components/form/SelectField.vue';
import { type Filter } from '@/utils/types/orderFilter';
import { getQueryRecipes } from '@/utils/recipe/queryRecipes';
import i18n from '@/i18n/index';
import type { CookGroup, CookGroupRecipe } from '@/utils/types/cookgroup';
import { getAuth } from 'firebase/auth';
import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import RecipeOrderFilter from '@/components/recipe/RecipeOrderFilter.vue';

const auth = getAuth();

// Cook groups
const cookGroups = ref<CookGroup[]>([]);
const currentCookGroupRecipes = ref<CookGroupRecipe[]>([]);
const selectedCookGroup = ref<string | undefined>();

// Get cook groups
onMounted(async () => {
  getData('cookGroups', getQueryCookGroups(auth.currentUser?.uid || ''))
    .then((data) => {
      cookGroups.value = data as CookGroup[];

      if (cookGroups.value.length > 0) {
        // Get the personal cook group
        const personalCookGroup = cookGroups.value.find((group) => group.personal == true);
        if (personalCookGroup) {
          personalCookGroup.name = i18n.global.t('cookGroupsPage.personalCookGroup');
          selectedCookGroup.value = personalCookGroup?.id;
        }
      } else {
        selectedCookGroup.value = undefined;
      }
    })
    .catch((error) => {
      console.error('Error getting cook groups from database:', error);
    });
});

// Recipes
const recipes = ref<Recipe[]>([]);
const noRecipes = ref<boolean>(false);
const order = ref<string>('lastEatenAsc');
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

// Get recipes based on the selected cook group and filter
watch(
  [selectedCookGroup, order, filter],
  async () => {
    getQueryRecipes(order.value, filter.value, selectedCookGroup.value || '')
      .then(async ({ cookGroupRecipes, recipeLastEatenOrder, recipeFilter }) => {
        currentCookGroupRecipes.value = cookGroupRecipes;

        recipes.value = (await getData('recipes', recipeFilter)) as Recipe[];
        // Order the recipes by last eaten if provided
        if (recipeLastEatenOrder.length > 0) {
          recipes.value = recipeLastEatenOrder
            .map((recipeId: string) => recipes.value.find((recipe) => recipe.id === recipeId))
            .filter(Boolean) as Recipe[];
        }
        recipes.value.forEach((recipe_1) => {
          setImage(recipe_1.id, recipe_1.image);
        });
        noRecipes.value = false;
      })
      .catch((error) => {
        noRecipes.value = true;
        console.error('Error getting recipes based on filter:', error);
      });
  },
  { immediate: true, deep: true }
);
</script>
