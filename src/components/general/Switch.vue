<template>
  <div class="switch" :class="variant">
    <Button
      :class="{ active: !input }"
      @click="input = false"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.TERTIARY"
      :size="size"
      >{{ textLeft }}</Button
    >
    <Button
      :class="{ active: input }"
      @click="input = true"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.TERTIARY"
      :size="size"
      >{{ textRight }}</Button
    >
  </div>
</template>

<script setup lang="ts">
import { Size, ColorVariant, ButtonType } from '@/utils/types/enums';
import { SwitchProps } from '@/utils/types/general';
import Button from '../form/Button.vue';

withDefaults(defineProps<SwitchProps>(), {
  variant: ColorVariant.TERTIARY,
  size: Size.MEDIUM
});

const input = defineModel<boolean>('input');
</script>
