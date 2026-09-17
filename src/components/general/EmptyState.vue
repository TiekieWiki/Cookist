<template>
  <div class="card">
    <div class="emptyState">
      <Pill :variant="ColorVariant.TERTIARY" :size="Size.XLARGE"
        ><font-awesome-icon :icon="['fas', icon]"
      /></Pill>
      <div>
        <h3>{{ $t(title) }}</h3>
        <p>{{ $t(subtitle) }}</p>
      </div>
      <router-link :to="buttonRoute" tabindex="-1">
        <Button :type="ButtonType.BUTTON" :variant="ColorVariant.PRIMARY" :size="Size.LARGE">
          <font-awesome-icon v-if="buttonIcon" :icon="['fas', buttonIcon]" />{{
            $t(buttonText)
          }}</Button
        ></router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Pill from './Pill.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import type { EmptyStateProps } from '@/utils/types/general.ts';

defineProps<EmptyStateProps>();
</script>
