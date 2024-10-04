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
        <div v-if="openFilter" class="filters">
          <check-box-list
            id="category"
            :label="$t('addRecipePage.category')"
            :items="filter.categories"
          />
          <div class="duration"></div>
          <div class="rating"></div>
          <div class="lastEaten"></div>
          <div class="ingredients"></div>
        </div>
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
import { OrderCategories } from '@/utils/types/order';
import { getQuery } from '@/utils/recipes/queryRecipes';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import i18n from '@/i18n';

const recipes = ref<Recipe[]>([]);
const order = ref<string>('lastEatenAsc');
const filter = ref({
  categories: Object.values(RecipeCategories).map((category) => ({
    id: category,
    name: category,
    label: i18n.global.t(`addRecipePage.categories.${category}`),
    required: false,
    disabled: false,
    autocomplete: 'off',
    checked: false
  }))
});

// Get recipes
watch(
  order,
  async () => {
    try {
      recipes.value = (await getData('recipes', getQuery(order.value))) as Recipe[];
      recipes.value.forEach((recipe) => {
        setImage(recipe.id, recipe.image);
      });
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
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

// Toggle filter
const openFilter = ref<boolean>(false);
</script>
