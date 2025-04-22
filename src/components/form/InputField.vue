<template>
  <label :id="id">
    {{ label }}
    <input
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
defineProps<{
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  ariaLabel: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  min?: number;
  max?: number;
  step?: number;
}>();

const input = defineModel<string | number | undefined>('input');
</script>
