<template>
  <label :id="id">
    {{ label }}
    <div class="select">
      <select v-model="selected" :aria-label="ariaLabel" :disabled="disabled">
        <option v-for="item in items" :value="item.value" :key="item.value">
          {{ $t(item.label) }}
        </option>
      </select>
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  items: { value: string; label: string }[];
}>();

const selected = defineModel<{ value: string; label: string }>('selected');
</script>
