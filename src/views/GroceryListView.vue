<template>
  <main class="groceryList">
    <article>
      <section class="header">
        <h2>{{ $t('groceryListPage.title') }}</h2>
      </section>
    </article>
    <article v-if="groceryList?.ingredients.length === 0" class="noCards">
      <h3>{{ $t('groceryListPage.noItems') }}</h3>
    </article>
    <article v-else>
      <section class="title">
        <h3>{{ $t('groceryListPage.ingredients') }}</h3>
      </section>
      <div class="label-group">
        <label v-for="ingredient in groceryList.ingredients" :key="ingredient.name">
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
            @change="updateIngredientUnit()"
          />
          {{ ingredient.name }}
        </label>
      </div>
    </article>
    <article class="card newCard">
      <section class="info">
        <input-field
          name="newIngredientAmount"
          :placeholder="$t('editRecipePage.placeholder.amount')"
          :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
          :step="0.01"
          type="number"
          v-model:input="newIngredient.amount"
        />
        <select-field
          :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
          :placeholder="$t('editRecipePage.placeholder.unit')"
          :items="
            Object.values(RecipeUnits).map((unit) => ({
              value: unit.toLowerCase(),
              label: unit.toLowerCase()
            }))
          "
          labelPrefix="editRecipePage.units."
          v-model:selected="newIngredient.unit"
        />
        <input-field
          name="newIngredientName"
          :placeholder="$t('editRecipePage.placeholder.ingredient')"
          :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
          type="text"
          v-model:input="newIngredient.name"
        />

        <button @click="addIngredient()" class="icon" type="button">
          <font-awesome-icon :icon="['fas', 'plus']" />
          {{ $t('recipePage.addToGroceryList') }}
        </button>
      </section>
      <error-message v-model:message="errorMessage" />
    </article>
  </main>
</template>

<script setup lang="ts">
import { getData, updateData } from '@/utils/db';
import type { GroceryList } from '@/utils/types/groceryList';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { getPossibleUnits } from '@/utils/recipe/ingredientUnits';
import { useIngredientUnit } from '@/composables/useIngredient';
import SelectField from '@/components/form/SelectField.vue';
import InputField from '@/components/form/InputField.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { type Ingredient, RecipeUnits } from '@/utils/types/recipe';

const initialGroceryList = ref<GroceryList>({
  id: '',
  ingredients: []
});
const groceryList = ref<GroceryList>({
  id: '',
  ingredients: []
});
const newIngredient = ref<Ingredient>({
  amount: 0,
  unit: '',
  name: ''
});
const errorMessage = ref<string>('');

// Get the grocery list
onMounted(async () => {
  await getData('groceryLists', where('id', '==', getAuth().currentUser?.uid))
    .then((list) => {
      if (list.length > 0) {
        initialGroceryList.value = list[0] as GroceryList;
        groceryList.value = {
          ...initialGroceryList.value,
          ingredients: JSON.parse(JSON.stringify(initialGroceryList.value.ingredients))
        };
      }
    })
    .catch((error: any) => {
      console.error('Error getting grocery list:', error);
    });
});

/**
 * Update the ingredient unit
 */
function updateIngredientUnit(): void {
  groceryList.value.ingredients = useIngredientUnit(
    initialGroceryList.value.ingredients,
    groceryList.value.ingredients,
    undefined,
    undefined
  );

  // Update the grocery list in the database
  updateData(
    'groceryLists',
    where('id', '==', getAuth().currentUser?.uid),
    groceryList.value
  ).catch((error) => {
    console.error('Error updating grocery list:', error);
  });
}

/**
 * Add a new ingredient to the grocery list
 */
function addIngredient(): void {
  if (
    newIngredient.value.name.trim() === '' ||
    newIngredient.value.unit === '' ||
    newIngredient.value.amount <= 0
  ) {
    errorMessage.value = 'groceryListPage.errors.invalidIngredient';
    return;
  }

  // Add the new ingredient to the grocery list
  groceryList.value.ingredients.push({
    ...newIngredient.value,
    name: newIngredient.value.name.toLowerCase()
  });

  // Reset the new ingredient input
  newIngredient.value = { amount: 0, unit: '', name: '' };

  // Update the grocery list in the database
  updateData(
    'groceryLists',
    where('id', '==', getAuth().currentUser?.uid),
    groceryList.value
  ).catch((error) => {
    console.error('Error updating grocery list:', error);
  });
}
</script>
