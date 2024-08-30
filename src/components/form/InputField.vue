<template>
  <label :id="id">
    {{ label }}
    <input
      :name="name"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :type="type"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
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
  disabled?: boolean;
  autocomplete?: string;
  min?: number;
  max?: number;
}>();

const input = defineModel<string | Date | number>('input');
</script>
