<template>
  <article v-if="groceryList?.ingredients.length <= 0" class="noCards">
    <h3>{{ $t('groceryListPage.noItems') }}</h3>
  </article>
  <article v-else>
    <section class="title">
      <h3>{{ $t('groceryListPage.ingredients') }}</h3>
      <div class="actions">
        <Button :type="ButtonType.BUTTON" :iconOnly="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="emptyGroceryListOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </section>
    <transition-group name="fade" tag="div" class="checkbox-list">
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
        <Button :type="ButtonType.BUTTON" @click="deleteIngredient(index)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </Button>
      </label>
    </transition-group>
  </article>
</template>

<script setup lang="ts">
import { useGroceryList } from '@/composables/useGroceryList';
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';

const { groceryList, emptyGroceryListOpen, deleteIngredient, changeIngredientUnit } =
  useGroceryList();
</script>
