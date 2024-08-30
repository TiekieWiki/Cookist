<template>
  <label :id="id">
    {{ label }}
    <div class="select">
      <select v-model="selected" :aria-label="ariaLabel" :disabled="disabled">
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="item in items" :value="item" :key="item">
          {{ $t(labelPrefix + item) }}
        </option>
      </select>
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
  ariaLabel: string;
  disabled?: boolean;
  placeholder?: string;
  items: string[];
  labelPrefix: string;
}>();

const selected = defineModel<string>('selected');
</script>
