<template>
  <label :for="id">
    <input
      :id="id"
      :name="name"
      type="checkbox"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      v-model="input"
    />
    {{ required ? label + ' *' : label }}
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
}>();

const input = defineModel<boolean>('input');
</script>
