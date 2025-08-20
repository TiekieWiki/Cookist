<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <textarea
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :required="required"
      :disabled="disabled"
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
  required?: boolean;
  disabled?: boolean;
}>();

const input = defineModel<string>('input');
</script>
