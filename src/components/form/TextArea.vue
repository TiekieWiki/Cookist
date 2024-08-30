<template>
  <label :id="id">
    {{ label }}
    <textarea :name="name" :placeholder="placeholder" :aria-label="ariaLabel" v-model="input" />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  name: string;
  label?: string;
  placeholder: string;
  ariaLabel: string;
}>();

const input = defineModel<string>('input');
</script>
