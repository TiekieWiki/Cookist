<template>
  <label class="toggle">
    <input type="checkbox" />
    <span class="slider" :class="variant"></span>
  </label>
</template>

<script setup lang="ts">
import { ColorVariant } from '@/utils/types/enums';

withDefaults(
  defineProps<{
    variant?: ColorVariant;
  }>(),
  {
    variant: ColorVariant.PRIMARY
  }
);
</script>
