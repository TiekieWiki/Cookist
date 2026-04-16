<template>
  <button
    :class="[
      variant,
      size,
      filled ? 'filled' : 'outline',
      $slots.icon && 'icon',
      iconOnly && 'iconOnly'
    ]"
    :type="type"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ButtonSize, ColorVariant } from '@/utils/types/enums';
import { ButtonProps } from '@/utils/types/form';

withDefaults(defineProps<ButtonProps>(), {
  variant: ColorVariant.PRIMARY,
  filled: true,
  size: ButtonSize.MEDIUM,
  required: false,
  disabled: false
});
</script>
