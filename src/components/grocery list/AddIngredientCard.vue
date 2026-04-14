<template>
  <article class="card newCard">
    <section class="info">
      <InputField
        name="newIngredientAmount"
        :placeholder="$t('editRecipePage.placeholder.amount')"
        :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
        :step="0.01"
        type="number"
        v-model:input="newIngredient.amount"
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
        v-model:selected="newIngredient.unit"
      />
      <InputField
        name="newIngredientName"
        :placeholder="$t('editRecipePage.placeholder.ingredient')"
        :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
        type="text"
        v-model:input="newIngredient.name"
      />

      <Button @click="addIngredient()" :type="ButtonType.BUTTON">
        <font-awesome-icon :icon="['fas', 'plus']" />
        {{ $t('recipePage.addToGroceryList') }}
      </Button>
    </section>
    <ErrorMessage v-model:message="errorMessage" />
  </article>
</template>

<script setup lang="ts">
import SelectField from '@/components/form/SelectField.vue';
import InputField from '@/components/form/InputField.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { RecipeUnits } from '@/utils/types/recipe';
import { useGroceryList } from '@/composables/useGroceryList';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';

const { newIngredient, errorMessage, addIngredient } = useGroceryList();
</script>
