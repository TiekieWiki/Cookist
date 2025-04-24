<template>
  <main class="recipes two-columns">
    <article>
      <div class="header">
        <h2>{{ $t('recipesPage.title') }}</h2>
        <select-field
          id="cookGroup"
          :ariaLabel="$t('recipesPage.ariaLabel.cookGroups')"
          :placeholder="$t('recipesPage.cookGroups')"
          :required="false"
          :items="
            cookGroups.map((group) => ({
              value: group.id,
              label: capitalizeFirstLetter(group.name)
            }))
          "
          v-model:selected="selectedCookGroup"
        />
      </div>
      <div class="sort">
        <input-field
          id="search"
          name="search"
          :ariaLabel="$t('recipesPage.ariaLabel.search')"
          type="text"
          :placeholder="$t('recipesPage.searchPlaceholder')"
          :required="false"
          :disabled="false"
          :autocomplete="'off'"
          v-model:input="filter.name"
        />
        <button @click="openFilter = !openFilter" type="button">
          <font-awesome-icon :icon="['fas', 'filter']" />{{ $t('recipesPage.filter') }}
        </button>
        <select-field
          id="order"
          :ariaLabel="$t('recipesPage.ariaLabel.order')"
          :placeholder="$t('recipesPage.order')"
          :required="false"
          :items="
            Object.values(RecipeOrderCategories).map((category) => ({
              value: category,
              label: category
            }))
          "
          labelPrefix="recipesPage.orders."
          v-model:selected="order"
        />
      </div>
      <Transition name="fade">
        <recipes-filter v-if="openFilter" v-model:filter="filter" />
      </Transition>
    </article>
    <article v-if="noRecipes" class="noRecipes">
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
          path: `/recipe/${currentCookGroupRecipes.find((group) => group.cookGroupId == selectedCookGroup && group.recipeId == recipe.id)?.id || ''}/${recipe.id}`
        })
      "
      tabindex="0"
    >
      <div class="title">
        <h3>{{ capitalizeFirstLetter(recipe.name) }}</h3>
        <div>
          <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
          <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
        </div>
      </div>
      <div class="info">
        <p>{{ capitalizeFirstLetter(recipe.category) }}</p>
        |
        <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}</p>
        |
        <p>
          <font-awesome-icon :icon="['fas', 'utensils']" />

          {{ recipe.portions }}
        </p>
        <template
          v-if="getRecipesLastEaten(recipe, currentCookGroupRecipes, selectedCookGroup ?? '')"
        >
          |
          <p>
            <font-awesome-icon :icon="['fas', 'calendar']" />
            {{ getRecipesLastEaten(recipe, currentCookGroupRecipes, selectedCookGroup ?? '') }}
          </p>
        </template>
      </div>
    </article>
    <article class="card newRecipe">
      <button
        @click="
          $router.push({
            path: '/add-recipe'
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
import { getData } from '@/utils/db';
import { getImage } from '@/utils/newRecipe/manageImage';
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import { onMounted, ref, watch } from 'vue';
import { capitalizeFirstLetter } from '@/utils/text';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import RecipesFilter from '@/components/RecipesFilter.vue';
import { RecipeOrderCategories, type Filter } from '@/utils/types/orderFilter';
import { getQueryRecipes } from '@/utils/recipes/queryRecipes';
import i18n from '@/i18n/index';
import type { CookGroup, CookGroupRecipe } from '@/utils/types/cookgroup';
import { getAuth } from 'firebase/auth';
import { getQueryCookGroups } from '@/utils/cookGroups/queryCookGroups';
import { getRecipesLastEaten } from '@/utils/recipes/lastEaten';

const auth = getAuth();

const cookGroups = ref<CookGroup[]>([]);
const currentCookGroupRecipes = ref<CookGroupRecipe[]>([]);
const selectedCookGroup = ref<string>();

// Get cook groups
onMounted(async () => {
  try {
    cookGroups.value = (await getData(
      'cookGroups',
      getQueryCookGroups(auth.currentUser?.uid || '')
    )) as CookGroup[];
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
  } catch (error) {
    console.error(error);
  }
});

// Get the recipes of the selected cook group
const recipes = ref<Recipe[]>([]);
const order = ref<string>('lastEatenAsc');

// Filter
const openFilter = ref<boolean>(false);
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
const noRecipes = ref<boolean>(false);

// Get recipes based on the selected cook group and filter
watch(
  [selectedCookGroup, order, filter],
  async () => {
    try {
      const { cookGroupRecipes, recipeLastEatenOrder, recipeFilter } = await getQueryRecipes(
        order.value,
        filter.value,
        selectedCookGroup.value || ''
      );
      currentCookGroupRecipes.value = cookGroupRecipes;
      recipes.value = (await getData('recipes', recipeFilter)) as Recipe[];

      // Order the recipes on last eaten if selected
      if (recipeLastEatenOrder.length > 0) {
        recipes.value = recipeLastEatenOrder
          .map((recipeId: string) => recipes.value.find((recipe) => recipe.id === recipeId))
          .filter(Boolean) as Recipe[];
      }

      recipes.value.forEach((recipe) => {
        setImage(recipe.id, recipe.image);
      });
      noRecipes.value = false;
    } catch (error) {
      noRecipes.value = true;
      console.error(error);
    }
  },
  { immediate: true, deep: true }
);

/**
 * Set the image to the recipe
 * @param id Recipe ID
 * @param image Image name
 */
function setImage(id: string, image: string) {
  getImage(image).then((url) => {
    const article = document.getElementById(id);
    if (article) {
      article.style.backgroundImage = `url(${url})`;
    }
  });
}
</script>
