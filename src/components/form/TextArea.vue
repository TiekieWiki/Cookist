<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <textarea
      :id="id"
      :name="name"
      :class="variant"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :required="required"
      :disabled="disabled"
      v-model="input"
    />
  </label>
</template>

<script setup lang="ts">
import { ColorVariant } from '@/utils/types/enums';
import { TextAreaProps } from '@/utils/types/form';

withDefaults(defineProps<TextAreaProps>(), {
  variant: ColorVariant.SECONDARY
});

const input = defineModel<string>('input');
</script>
