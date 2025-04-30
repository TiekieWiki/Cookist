<template>
  <main class="recipe two-columns">
    <article>
      <div class="header">
        <h2>{{ capitalizeFirstLetter(recipe.name) }}</h2>
        <font-awesome-icon
          v-if="recipe.owner === getAuth().currentUser?.uid"
          @click="
            $router.push({
              path: `/edit-recipe/${cookGroupRecipe.id}`
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
import { getRecipeLastEaten } from '@/utils/recipe/lastEaten';
import { useSetRecipeImage } from '@/composables/useManageImage';
import { ref, watch } from 'vue';
import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import {
  emptyCookGroup,
  emptyCookGroupRecipe,
  type CookGroup,
  type CookGroupRecipe
} from '@/utils/types/cookgroup';

const auth = getAuth();
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
const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());

// Get the recipe from the database
watch(
  [route.params.cookGroupRecipeId],
  async () => {
    try {
      // Get the cook group recipe
      const cookGroupRecipes = await getData(
        'cookGroupRecipes',
        where('id', '==', route.params.cookGroupRecipeId)
      );
      if (cookGroupRecipes.length > 0) {
        cookGroupRecipe.value = cookGroupRecipes[0] as CookGroupRecipe;

        // Check if the user has access to the cook group recipe
        const cookGroups = (await getData(
          'cookGroups',
          getQueryCookGroups(auth.currentUser?.uid || '')
        )) as CookGroup[];
        if (
          cookGroups.length > 0 ||
          cookGroups.some((group) => group.id === cookGroupRecipe.value.cookGroupId)
        ) {
          // Get the recipe
          const recipes = await getData(
            'recipes',
            where('id', '==', cookGroupRecipe.value.recipeId)
          );
          if (recipes.length > 0) {
            recipe.value = recipes[0] as Recipe;

            // Get the recipe last eaten date
            const lastEatenDate = await getRecipeLastEaten(cookGroupRecipe.value.id as string);
            lastEaten.value = lastEatenDate
              ? lastEatenDate.toDate().toLocaleDateString()
              : undefined;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

// Set the image
useSetRecipeImage(recipe);
</script>
