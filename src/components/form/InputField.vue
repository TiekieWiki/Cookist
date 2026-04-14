<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <input
      :class="variant"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :type="type"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
      :step="step"
      v-model="input"
    />
  </label>
</template>

<script setup lang="ts">
import { AutoCompleteVariant, ColorVariant } from '@/utils/types/enums';

withDefaults(
  defineProps<{
    id?: string;
    name: string;
    variant?: ColorVariant;
    label?: string;
    placeholder?: string;
    ariaLabel: string;
    type: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: AutoCompleteVariant;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    variant: ColorVariant.PRIMARY,
    required: false,
    disabled: false,
    autocomplete: AutoCompleteVariant.OFF
  }
);

const input = defineModel<string | number | undefined>('input');
</script>
