<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        :role="toast.type === 'error' ? 'alert' : 'status'"
      >
        <font-awesome-icon
          :icon="['fas', toast.type === 'error' ? 'circle-exclamation' : 'circle-check']"
        />
        <div class="content">
          <strong>{{ $t(toast.title) }}</strong>
          <p v-if="toast.message">{{ $t(toast.message) }}</p>
        </div>
        <Button
          @click="toastStore.dismissToast(toast.id)"
          :aria-label="$t('general.ariaLabel.close')"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.SMALL"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </Button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import { useToastStore } from '@/stores/useToastStore';

const toastStore = useToastStore();
</script>
