<template>
  <label :id="id">
    {{ $t(label) }}
    <textarea
      :name="name"
      :placeholder="$t(placeholder)"
      :aria-label="$t(ariaLabel)"
      v-model="input"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  name: string;
  label: string;
  placeholder: string;
  ariaLabel: string;
}>();

const input = defineModel<string>('input');
</script>
