<template>
  <section class="card">
    <InputList
      id="ingredients"
      :label="$t('editRecipePage.ingredients')"
      :required="true"
      :colAmount="ColAmount.FOUR"
      v-model:items="ingredients"
      v-slot="{ index }"
    >
      <InputField
        :name="'amount ' + index"
        :placeholder="$t('editRecipePage.placeholder.amount')"
        :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
        :step="0.01"
        type="number"
        v-model:input="ingredients[index].amount"
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
        v-model:selected="ingredients[index].unit"
      />
      <InputField
        :name="'ingredient ' + index"
        :placeholder="$t('editRecipePage.placeholder.ingredient')"
        :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
        type="text"
        v-model:input="ingredients[index].name"
        @input="addInputRow(ingredients, index, { amount: 0, unit: '', name: '' })"
      />
    </InputList>
  </section>
</template>

<script setup lang="ts">
import { Ingredient, RecipeUnits } from '@/utils/types/recipe';
import { addInputRow } from '@/utils/global/list';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import SelectField from '@/components/form/SelectField.vue';
import { ColAmount } from '@/utils/types/enums';

const ingredients = defineModel<Ingredient[]>('ingredients', { required: true });
const save = defineEmits<{ save: [boolean] }>();
</script>
