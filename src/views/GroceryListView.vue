<template>
  <main class="groceryList">
    <article>
      <section class="header">
        <h2>{{ $t('groceryListPage.title') }}</h2>
      </section>
    </article>
    <article v-if="groceryList?.ingredients.length <= 0" class="noCards">
      <h3>{{ $t('groceryListPage.noItems') }}</h3>
    </article>
    <article v-else>
      <section class="title">
        <h3>{{ $t('groceryListPage.ingredients') }}</h3>
        <div class="actions">
          <font-awesome-icon
            @click="emptyGroceryListOpen = true"
            class="delete"
            :icon="['fas', 'trash-can']"
          />
        </div>
      </section>
      <transition-group name="fade" tag="div" class="label-group">
        <label v-for="(ingredient, index) in groceryList.ingredients" :key="ingredient.name">
          <input :name="ingredient.name" type="checkbox" @input="deleteIngredient(index)" />
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
          <button class="icon delete" type="button" @click="deleteIngredient(index)">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </label>
      </transition-group>
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
  <confirm-pop-up
    :title="$t('groceryListPage.emptyGroceryList')"
    :section="$t('groceryListPage.confirmEmpty')"
    :cancel="'groceryListPage.cancel'"
    :confirm="'groceryListPage.empty'"
    v-model:open-pop-up="emptyGroceryListOpen"
    @confirm="emptyGroceryList()"
  />
</template>

<script setup lang="ts">
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import InputField from '@/components/form/InputField.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import { RecipeUnits } from '@/utils/types/recipe';
import { useGroceryList } from '@/composables/useGroceryList';

const {
  groceryList,
  newIngredient,
  errorMessage,
  emptyGroceryListOpen,
  addIngredient,
  deleteIngredient,
  emptyGroceryList,
  changeIngredientUnit
} = useGroceryList();
</script>
