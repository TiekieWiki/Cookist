<template>
  <div ref="dropdown" class="dropdown">
    <Button
      @click="isOpen = !isOpen"
      class="ellipsis"
      :aria-label="$t('general.ariaLabel.toggleDropdown')"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      aria-haspopup="true"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.TERTIARY"
    >
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </Button>
    <div :id="menuId" :class="['items', { open: isOpen }]" @click="isOpen = false">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useId } from 'vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';

const dropdown = ref<HTMLElement | null>(null);
const isOpen = ref<boolean>(false);
const menuId = useId();

/**
 * Close the dropdown on Escape
 * @param event Keyboard event
 */
function closeOnEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') isOpen.value = false;
}

/**
 * Close the dropdown when clicking outside of it
 * @param event Mouse event
 */
function closeOnOutsideClick(event: MouseEvent): void {
  if (!dropdown.value?.contains(event.target as Node)) isOpen.value = false;
}

onMounted(() => {
  window.addEventListener('keydown', closeOnEscape);
  window.addEventListener('click', closeOnOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('keydown', closeOnEscape);
  window.removeEventListener('click', closeOnOutsideClick);
});
</script>
