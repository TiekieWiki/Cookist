<template>
  <main class="recipe two-columns">
    <article>
      <section class="header">
        <h2>{{ capitalizeFirstLetter(recipe.name) }}</h2>
        <div v-if="recipe.owner === getAuth().currentUser?.uid" class="actions">
          <font-awesome-icon
            @click="
              $router.push({
                path: `/edit-recipe/${cookGroupRecipe.id}`
              })
            "
            class="edit"
            :icon="['fas', 'pen']"
          />
          <font-awesome-icon
            @click="deleteRecipeOpen = true"
            class="delete"
            :icon="['fas', 'trash-can']"
          />
        </div>
      </section>
      <section class="info">
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
      </section>
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
  <teleport to="body" v-if="deleteRecipeOpen">
    <main class="modal">
      <article>
        <section class="header">
          <h2>{{ $t('recipePage.deleteRecipe') }}</h2>
          <h2>
            <font-awesome-icon @click="deleteRecipeOpen = false" :icon="['fas', 'xmark']" />
          </h2>
        </section>
        <section class="content">
          <p>{{ $t('recipePage.confirmDelete') }}</p>
        </section>
        <section class="footer">
          <button @click="deleteRecipeOpen = false" type="button">
            {{ $t('recipePage.cancel') }}
          </button>
          <button @click.prevent="deleteRecipe()" type="submit">
            {{ $t('recipePage.delete') }}
          </button>
        </section>
      </article>
    </main>
  </teleport>
</template>

<script setup lang="ts">
import type { Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router';
import { capitalizeFirstLetter } from '@/utils/text';
import { getRecipeLastEaten } from '@/utils/recipe/lastEaten';
import { useSetRecipeImage } from '@/composables/useManageImage';
import { ref, watch } from 'vue';
import { emptyCookGroupRecipe, type CookGroupRecipe } from '@/utils/types/cookgroup';
import { useSecureRecipe } from '@/composables/useSecurity';
import { deleteData } from '@/utils/db';
import { where } from 'firebase/firestore';

const route = useRoute();
const router = useRouter();

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
    // Get the recipe if user has access to it
    useSecureRecipe(route.params.cookGroupRecipeId as string, cookGroupRecipe, recipe).then(
      async (result) => {
        if (result) {
          // Get the recipe last eaten date
          const lastEatenDate = getRecipeLastEaten(cookGroupRecipe.value as CookGroupRecipe);
          lastEaten.value = lastEatenDate ? lastEatenDate.toDate().toLocaleDateString() : undefined;
        }
      }
    );
  },
  { immediate: true }
);

// Set the image
useSetRecipeImage(recipe);

// Delete recipe
const deleteRecipeOpen = ref<boolean>(false);

/*
 * Delete the recipe
 */
async function deleteRecipe(): Promise<void> {
  // Delete the recipe
  deleteData('recipes', where('id', '==', recipe.value.id))
    .then(() => {
      // Delete the cook group recipes
      return deleteData('cookGroupRecipes', where('recipeId', '==', recipe.value.id));
    })
    .then(() => {
      // Redirect to recipes page
      router.push({ path: '/recipes' });
    })
    .catch((error) => {
      console.error('Error deleting recipe:', error);
    });
}
</script>
