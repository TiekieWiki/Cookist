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
import { TextAreaProps } from '@/utils/types/form';

defineProps<TextAreaProps>();

const input = defineModel<string>('input');
</script>
