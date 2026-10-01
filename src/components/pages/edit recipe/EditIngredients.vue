<template>
  <section class="card">
    <InputList
      id="ingredients"
      :label="$t('general.recipe.ingredients')"
      :required="true"
      :colAmount="ColAmount.FOUR"
      v-model:items="ingredients"
      v-slot="{ index }"
    >
      <IngredientInputRow
        :name="'ingredient-' + index"
        v-model:ingredient="ingredients[index]"
        @name-input="addInputRow(ingredients, index, { amount: 0, unit: '', name: '' })"
      />
    </InputList>
  </section>
</template>

<script setup lang="ts">
import { type Ingredient } from '@/utils/types/recipe';
import { addInputRow } from '@/utils/global/list';
import InputList from '@/components/form/InputList.vue';
import IngredientInputRow from '@/components/general/IngredientInputRow.vue';
import { ColAmount } from '@/utils/types/enums';

const ingredients = defineModel<Ingredient[]>('ingredients', { required: true });
</script>
