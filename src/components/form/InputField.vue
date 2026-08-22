<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <input
      :id="id"
      :name="name"
      :class="variant"
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
import { InputFieldProps } from '@/utils/types/form';

const props = withDefaults(defineProps<InputFieldProps>(), {
  variant: ColorVariant.SECONDARY,
  required: false,
  disabled: false,
  autocomplete: AutoCompleteVariant.OFF
});

const input = defineModel<string | number | undefined>('input');
</script>
