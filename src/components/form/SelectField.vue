<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}
    <div class="select" :class="variant" :required="required">
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
import { ColorVariant } from '@/utils/types/enums';

withDefaults(
  defineProps<{
    id?: string;
    variant?: ColorVariant;
    label?: string;
    placeholder?: string;
    ariaLabel: string;
    required?: boolean;
    disabled?: boolean;
    items: { value: string; label: string }[];
    labelPrefix?: string;
  }>(),
  {
    variant: ColorVariant.PRIMARY,
    required: false,
    disabled: false
  }
);

const selected = defineModel<string>('selected');
</script>
