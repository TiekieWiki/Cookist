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
      <section class="title">
        <h3>{{ $t('recipePage.ingredients') }}</h3>
        <div class="portionCalculator">
          <font-awesome-icon
            @click="portionCount = Math.max(portionCount - 1, 1)"
            class="edit"
            :icon="['fas', 'minus']"
          />
          <p>{{ portionCount }} {{ $t('recipePage.portions', portionCount) }}</p>
          <font-awesome-icon @click="portionCount++" class="edit" :icon="['fas', 'plus']" />
        </div>
      </section>
      <div class="label-group">
        <label v-for="ingredient in recipe.ingredients" :key="ingredient.name">
          <input :name="ingredient.name" type="checkbox" />
          {{
            recipe.portions
              ? (ingredient.amount / recipe.portions) * portionCount
              : ingredient.amount * portionCount
          }}
          {{ $t(`editRecipePage.units.${ingredient.unit}`) }}
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
      <div :class="['timer', timer.isFinished ? 'finished' : '']">
        <font-awesome-icon class="edit" :icon="['fas', 'stopwatch']" />
        <font-awesome-icon
          @click="timer.minutes = Math.max(timer.minutes - 1, 0)"
          class="edit"
          :icon="['fas', 'minus']"
        />
        <input-field
          name="hours"
          :placeholder="$t('recipePage.placeholder.hours')"
          :ariaLabel="$t('recipePage.ariaLabel.hours')"
          :step="1"
          type="number"
          v-model:input="timer.hours"
        />
        :
        <input-field
          name="minutes"
          :placeholder="$t('recipePage.placeholder.minutes')"
          :ariaLabel="$t('recipePage.ariaLabel.minutes')"
          :step="1"
          type="number"
          v-model:input="timer.minutes"
        />
        :
        <input-field
          name="seconds"
          :placeholder="$t('recipePage.placeholder.seconds')"
          :ariaLabel="$t('recipePage.ariaLabel.seconds')"
          :step="1"
          type="number"
          v-model:input="timer.seconds"
        />
        <font-awesome-icon @click="timer.minutes++" class="edit" :icon="['fas', 'plus']" />
        <button @click="timer.isRunning = !timer.isRunning" class="icon" type="button">
          <font-awesome-icon v-if="timer.isRunning" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else :icon="['fas', 'play']" />
        </button>
      </div>
      <button @click="updateLastEaten" :disabled="lastEatenToday" class="icon" type="button">
        <font-awesome-icon v-if="lastEatenToday" :icon="['fas', 'check']" />
        <font-awesome-icon v-else :icon="['fas', 'calendar']" />{{ $t('recipePage.eatenToday') }}
      </button>
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
import { deleteData, updateData } from '@/utils/db';
import { Timestamp, where } from 'firebase/firestore';
import InputField from '@/components/form/InputField.vue';
import { useTimer } from '@/composables/useTimer';

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
const lastEatenToday = ref<boolean>(false);
const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());
const portionCount = ref<number>(1);

// Get the recipe from the database
watch(
  [route.params.cookGroupRecipeId],
  async () => {
    // Get the recipe if user has access to it
    useSecureRecipe(route.params.cookGroupRecipeId as string, cookGroupRecipe, recipe)
      .then(async (result) => {
        if (result) {
          // Get the recipe last eaten date
          const lastEatenDate = getRecipeLastEaten(cookGroupRecipe.value as CookGroupRecipe);
          lastEaten.value = lastEatenDate ? lastEatenDate.toDate().toLocaleDateString() : undefined;
          lastEatenToday.value = lastEatenDate
            ? lastEatenDate.toDate().toLocaleDateString() === new Date().toLocaleDateString()
            : false;

          portionCount.value = recipe.value.portions || 1;
        }
      })
      .catch((error) => {
        console.error('Error getting recipe:', error);
      });
  },
  { immediate: true }
);

// Set the image
useSetRecipeImage(recipe);

// Initialize timer
const { timer, startTimer, pauseTimer } = useTimer();

watch(
  () => timer.value.isRunning,
  (isRunning) => {
    if (isRunning) {
      startTimer();
    } else {
      pauseTimer();
    }
  }
);

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

/**
 * Update the last eaten date for the recipe
 * @returns {Promise<void>} - A promise that resolves when the last eaten date is updated
 */
async function updateLastEaten(): Promise<void> {
  cookGroupRecipe.value.lastEaten = Timestamp.fromMillis(Date.now());
  updateData('cookGroupRecipes', where('id', '==', cookGroupRecipe.value.id), cookGroupRecipe.value)
    .then(() => {
      // Update the last eaten date
      lastEaten.value = cookGroupRecipe.value.lastEaten
        ? cookGroupRecipe.value.lastEaten.toDate().toLocaleDateString()
        : undefined;
      lastEatenToday.value = true;
    })
    .catch((error) => {
      console.error('Error updating last eaten date:', error);
    });
}
</script>
