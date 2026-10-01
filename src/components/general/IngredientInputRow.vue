<template>
  <InputField
    :name="name + '-amount'"
    :placeholder="$t('general.recipe.placeholder.amount')"
    :ariaLabel="$t('general.recipe.ariaLabel.amount')"
    :step="0.01"
    type="number"
    v-model:input="ingredient.amount"
  />
  <SelectField
    :ariaLabel="$t('general.recipe.ariaLabel.unit')"
    :placeholder="$t('general.recipe.placeholder.unit')"
    :items="unitOptions"
    labelPrefix="general.recipe.units."
    v-model:selected="ingredient.unit"
  />
  <InputField
    :name="name + '-name'"
    :placeholder="$t('general.recipe.placeholder.ingredient')"
    :ariaLabel="$t('general.recipe.ariaLabel.ingredient')"
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
