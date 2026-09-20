<template>
  <label :for="id" class="radiobutton">
    <input
      :class="variant"
      :id="id"
      :name="name"
      type="radio"
      :value="value"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      v-model="selected"
    />
    {{ required ? label + ' *' : label }}
  </label>
</template>

<script setup lang="ts">
import { ColorVariant } from '@/utils/types/enums';
import { type RadioButtonProps } from '@/utils/types/form';

withDefaults(defineProps<RadioButtonProps>(), {
  variant: ColorVariant.PRIMARY
});

const selected = defineModel<string | number | null>('selected');
</script>
