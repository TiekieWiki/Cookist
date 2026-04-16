<template>
  <label :for="id">
    <input
      :class="variant"
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
import { ColorVariant } from '@/utils/types/enums';
import { CheckBoxProps } from '@/utils/types/form';

withDefaults(defineProps<CheckBoxProps>(), {
  variant: ColorVariant.PRIMARY
});

const input = defineModel<boolean>('input');
</script>
