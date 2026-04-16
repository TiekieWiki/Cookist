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
import { SelectFieldProps } from '@/utils/types/form';

withDefaults(defineProps<SelectFieldProps>(), {
  variant: ColorVariant.PRIMARY,
  required: false,
  disabled: false
});

const selected = defineModel<string>('selected');
</script>
