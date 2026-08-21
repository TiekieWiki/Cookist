<template>
  <label class="toggle">
    <input type="checkbox" v-model="input" />
    <span class="slider" :class="variant"></span>
  </label>
</template>

<script setup lang="ts">
import { ColorVariant } from '@/utils/types/enums';
import { ToggleProps } from '@/utils/types/form';

withDefaults(defineProps<ToggleProps>(), {
  variant: ColorVariant.PRIMARY
});

const input = defineModel<boolean>('input');
</script>
