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
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      v-model="input"
    />
    <FieldError :id="errorId" :message="error" />
  </label>
</template>

<script setup lang="ts">
import { AutoCompleteVariant, ColorVariant } from '@/utils/types/enums';
import { type InputFieldProps } from '@/utils/types/form';
import { useId } from 'vue';
import FieldError from './FieldError.vue';

withDefaults(defineProps<InputFieldProps>(), {
  variant: ColorVariant.SECONDARY,
  required: false,
  disabled: false,
  autocomplete: AutoCompleteVariant.OFF
});

const input = defineModel<string | number | null | undefined>('input');

const errorId = useId();
</script>
