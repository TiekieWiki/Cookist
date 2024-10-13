<template>
  <main class="recipes two-columns">
    <article>
      <div class="header">
        <h2>{{ $t('recipesPage.title') }}</h2>
        <div class="sort">
          <button @click="openFilter = !openFilter" type="button">
            <font-awesome-icon :icon="['fas', 'filter']" />{{ $t('recipesPage.filter') }}
          </button>
          <select-field
            id="order"
            :ariaLabel="$t('recipesPage.ariaLabel.order')"
            :placeholder="$t('recipesPage.order')"
            :required="false"
            :items="
              Object.values(OrderCategories).map((category) => ({
                value: category,
                label: category
              }))
            "
            labelPrefix="recipesPage.orders."
            v-model:selected="order"
          />
        </div>
      </div>
      <Transition name="fade">
        <recipes-filter v-if="openFilter" v-model:filter="filter" />
      </Transition>
    </article>
    <template v-for="recipe in recipes" :key="recipe.id">
      <article class="card" :id="recipe.id" @click="$router.push({ path: `/recipe/${recipe.id}` })">
        <div class="title">
          <h3>{{ recipe.name }}</h3>
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
          |
          <p>
            <font-awesome-icon :icon="['far', 'calendar']" />
            {{ recipe.lastEaten!.toDate().toLocaleDateString() }}
          </p>
        </div>
      </article>
    </template>
  </main>
</template>

<script setup lang="ts">
import { getData } from '@/utils/db';
import { getImage } from '@/utils/newRecipe/manageImage';
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import { ref, watch } from 'vue';
import { capitalizeFirstLetter } from '@/utils/text';
import SelectField from '@/components/form/SelectField.vue';
import RecipesFilter from '@/components/RecipesFilter.vue';
import { OrderCategories, type Filter } from '@/utils/types/orderFilter';
import { getQuery } from '@/utils/recipes/queryRecipes';
import i18n from '@/i18n';
import { Timestamp } from 'firebase/firestore';

const recipes = ref<Recipe[]>([]);
const order = ref<string>('lastEatenAsc');

// Filter
const openFilter = ref<boolean>(false);
const filter = ref<Filter>({
  categories: Object.values(RecipeCategories).map((category) => ({
    id: category,
    name: category,
    label: i18n.global.t(`addRecipePage.categories.${category}`),
    required: false,
    disabled: false,
    autocomplete: 'off',
    checked: false
  })),
  durationMin: 0,
  durationMax: 10080,
  ratingMin: 0,
  ratingMax: 5,
  lastEatenMin: Timestamp.fromDate(new Date(0)),
  lastEatenMax: Timestamp.fromDate(new Date()),
  ingredients: [{ name: '' }]
});

// Get recipes
watch(
  [order, filter],
  async () => {
    try {
      recipes.value = (await getData('recipes', getQuery(order.value, filter.value))) as Recipe[];
      recipes.value.forEach((recipe) => {
        setImage(recipe.id, recipe.image);
      });
    } catch (error) {
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
