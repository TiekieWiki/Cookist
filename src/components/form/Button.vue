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
import { ButtonSize, ButtonType, ColorVariant } from '@/utils/types/enums';

withDefaults(
  defineProps<{
    variant?: ColorVariant;
    type: ButtonType;
    filled?: boolean;
    size?: ButtonSize;
    iconOnly?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: ColorVariant.PRIMARY,
    filled: true,
    size: ButtonSize.MEDIUM,
    required: false,
    disabled: false
  }
);
</script>
