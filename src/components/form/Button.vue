<template>
  <router-link v-if="to" :to="to" :class="['button', variant, size]">
    <slot></slot>
  </router-link>
  <button v-else :class="[variant, size]" :type="type" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { Size, ColorVariant } from '@/utils/types/enums';
import { type ButtonProps } from '@/utils/types/form';

withDefaults(defineProps<ButtonProps>(), {
  variant: ColorVariant.PRIMARY,
  size: Size.MEDIUM,
  disabled: false
});
</script>
