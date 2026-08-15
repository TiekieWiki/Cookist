<template>
  <span class="pill" :class="size">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { Size } from '@/utils/types/enums';
import { PillProps } from '@/utils/types/general';

withDefaults(defineProps<PillProps>(), {
  size: Size.MEDIUM
});
</script>
