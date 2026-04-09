<template>
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
        <SelectField
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
</template>

<script setup lang="ts">
import { useGroceryList } from '@/composables/useGroceryList';
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';

const { groceryList, emptyGroceryListOpen, deleteIngredient, changeIngredientUnit } =
  useGroceryList();
</script>
