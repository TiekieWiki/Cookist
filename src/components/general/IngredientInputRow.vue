<template>
  <InputField
    :name="name + '-amount'"
    :placeholder="$t('editRecipePage.placeholder.amount')"
    :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
    :step="0.01"
    type="number"
    v-model:input="ingredient.amount"
  />
  <SelectField
    :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
    :placeholder="$t('editRecipePage.placeholder.unit')"
    :items="unitOptions"
    labelPrefix="editRecipePage.units."
    v-model:selected="ingredient.unit"
  />
  <InputField
    :name="name + '-name'"
    :placeholder="$t('editRecipePage.placeholder.ingredient')"
    :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
    type="text"
    v-model:input="ingredient.name"
    @input="emit('nameInput')"
  />
</template>

<script setup lang="ts">
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import { toSelectOptions } from '@/utils/global/selectOptions';
import { type Ingredient, RecipeUnits } from '@/utils/types/recipe';

defineProps<{ name: string }>();

const emit = defineEmits<{ nameInput: [] }>();
const ingredient = defineModel<Ingredient>('ingredient', { required: true });

const unitOptions = toSelectOptions(RecipeUnits);
</script>
