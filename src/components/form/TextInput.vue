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
      v-model="input"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  name: string;
  label?: string;
  placeholder: string;
  ariaLabel: string;
  type: string;
  disabled?: boolean;
  autocomplete?: string;
}>();

const input = defineModel<string>('input');
</script>
