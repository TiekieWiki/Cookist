<template>
  <label :id="id">
    {{ label }}
    <div class="select" :required="required">
      <select v-model="selected" :aria-label="ariaLabel" :disabled="disabled">
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="item in items" :value="item.value" :key="item.value">
          {{ labelPrefix ? $t(labelPrefix + item.label) : item.label }}
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
  required?: boolean;
  items: { value: string; label: string }[];
  labelPrefix?: string;
}>();

const selected = defineModel<string>('selected');
</script>
