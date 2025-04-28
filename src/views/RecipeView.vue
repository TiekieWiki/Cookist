<template>
  <main class="recipe two-columns">
    <article>
      <div class="header">
        <h2>{{ capitalizeFirstLetter(recipe.name) }}</h2>
        <font-awesome-icon
          v-if="recipe.owner === getAuth().currentUser?.uid"
          @click="
            $router.push({
              path: `/edit-recipe/${recipe.id}`
            })
          "
          class="edit"
          :icon="['fas', 'pen']"
        />
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
        <template v-if="lastEaten">
          |
          <p>
            <font-awesome-icon :icon="['fas', 'calendar']" />
            {{ lastEaten }}
          </p>
        </template>
        |
        <div>
          <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
          <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
        </div>
      </div>
      <p v-if="recipe.notes">{{ recipe.notes }}</p>
    </article>
    <article>
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="label-group">
        <label v-for="ingredient in recipe.ingredients" :key="ingredient.name">
          <input :name="ingredient.name" type="checkbox" />
          {{ ingredient.amount }} {{ $t(`editRecipePage.units.${ingredient.unit}`) }}
          {{ ingredient.name }}
        </label>
      </div>
    </article>
    <article>
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="label-group">
        <label v-for="instruction in recipe.instructions" :key="instruction">
          <input :name="instruction" type="checkbox" />
          {{ capitalizeFirstLetter(instruction) }}
        </label>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { getData } from '@/utils/db';
import type { Recipe } from '@/utils/types/recipe';
import { where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRoute } from 'vue-router';
import { capitalizeFirstLetter } from '@/utils/text';
import { getRecipeLastEaten } from '@/utils/recipes/lastEaten';
import { useSetRecipeImage } from '@/composables/useManageImage';
import { ref, watch } from 'vue';

const route = useRoute();

// Recipe
const recipe = ref<Recipe>({
  id: '',
  owner: '',
  name: '',
  category: '',
  duration: undefined,
  portions: undefined,
  rating: undefined,
  image: '',
  ingredients: [{ amount: 0, unit: '', name: '' }],
  instructions: [''],
  notes: '',
  filterIngredients: []
});
const lastEaten = ref<string>();

// Get the recipe data
watch(
  [route.params.cookGroupRecipeId, route.params.recipeId],
  async () => {
    try {
      const recipes = await getData('recipes', where('id', '==', route.params.recipeId));
      if (recipes.length > 0) {
        recipe.value = recipes[0] as Recipe;
      }

      // Get the recipe last eaten date
      const lastEatenDate = await getRecipeLastEaten(route.params.cookGroupRecipeId as string);
      lastEaten.value = lastEatenDate ? lastEatenDate.toDate().toLocaleDateString() : undefined;
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

// Set the image
useSetRecipeImage(recipe);
</script>
