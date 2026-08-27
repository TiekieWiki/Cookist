<template>
  <span class="pill" :class="[variant, size]">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { ColorVariant, Size } from '@/utils/types/enums';
import { PillProps } from '@/utils/types/general';

withDefaults(defineProps<PillProps>(), {
  variant: ColorVariant.PRIMARY,
  size: Size.SMALL
});
</script>
