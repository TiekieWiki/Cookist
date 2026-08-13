<template>
  <section>
    <InputField
      name="newIngredientAmount"
      :placeholder="$t('editRecipePage.placeholder.amount')"
      :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
      :step="0.01"
      type="number"
      v-model:input="ingredient.amount"
    />
    <SelectField
      :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
      :placeholder="$t('editRecipePage.placeholder.unit')"
      :items="
        Object.values(RecipeUnits).map((unit) => ({
          value: unit.toLowerCase(),
          label: unit.toLowerCase()
        }))
      "
      labelPrefix="editRecipePage.units."
      v-model:selected="ingredient.unit"
    />
    <InputField
      name="newIngredientName"
      :placeholder="$t('editRecipePage.placeholder.ingredient')"
      :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
      type="text"
      v-model:input="ingredient.name"
    />

    <Button
      @click="groceryListStore.setGroceryList(ingredient)"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.SECONDARY"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
      {{ $t('groceryListPage.addItem') }}
    </Button>
  </section>
  <ErrorMessage v-model:message="groceryListStore.errorMessage" />
</template>

<script setup lang="ts">
import SelectField from '@/components/form/SelectField.vue';
import InputField from '@/components/form/InputField.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { emptyIngredient, Ingredient, RecipeUnits } from '@/utils/types/recipe';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { ref } from 'vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';

const groceryListStore = useGroceryListStore();

const ingredient = ref<Ingredient>(emptyIngredient());
</script>
