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
        <label v-for="(ingredient, index) in recipe.ingredients" :key="ingredient.name">
          <input :name="ingredient.name" type="checkbox" />
          {{ ingredient.amount }}
          <select-field
            :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
            :placeholder="$t('editRecipePage.placeholder.unit')"
            :items="
              Object.values(getPossibleUnits(ingredient.unit)).map((unit) => ({
                value: unit.toLowerCase(),
                label: unit.toLowerCase()
              }))
            "
            labelPrefix="editRecipePage.units."
            v-model:selected="ingredient.unit"
            @change="changeIngredientUnit()"
          />
          {{ ingredient.name }}
        </label>
      </div>
      <button @click="addToGroceryList(recipe.ingredients)" class="icon" type="button">
        <font-awesome-icon :icon="['fas', 'plus']" />
        {{ $t('recipePage.addToGroceryList') }}
      </button>
    </article>
    <article>
      <section class="title">
        <h3>{{ $t('recipePage.instructions') }}</h3>
        <div class="actions">
          {{ $t('recipePage.keepOnScreen') }}
          <label @click="keepScreenOn = !keepScreenOn" class="toggle">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </section>
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
  <confirm-pop-up
    v-model:open-pop-up="deleteRecipeOpen"
    :title="$t('recipePage.deleteRecipe')"
    :section="$t('recipePage.confirmDelete')"
    :cancel="$t('recipePage.cancel')"
    :confirm="$t('recipePage.delete')"
    @confirm="deleteRecipe(recipe.id)"
  />
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { useSetRecipeImage } from '@/composables/useManageImage';
import { ref } from 'vue';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import { useTimer } from '@/composables/useTimer';
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { addToGroceryList } from '@/utils/grocery list/editGroceryList';
import { useRecipe } from '@/composables/useRecipe';
import { deleteRecipe } from '@/utils/recipe/deleteRecipe';

const {
  recipe,
  cookGroupRecipe,
  initialIngredients,
  lastEaten,
  lastEatenToday,
  portionCount,
  updateLastEaten
} = useRecipe();

// Set the image
useSetRecipeImage(recipe);

/**
 * Update the ingredient unit
 */
function changeIngredientUnit(): void {
  recipe.value.ingredients = updateIngredientUnit(
    initialIngredients.value,
    recipe.value.ingredients,
    recipe.value.portions,
    portionCount.value
  );
}

// Keep screen on
const { keepScreenOn } = useKeepScreenOn();

// Initialize timer
const { timer } = useTimer();

// Delete recipe
const deleteRecipeOpen = ref<boolean>(false);
</script>
