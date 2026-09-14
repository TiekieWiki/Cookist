<template>
  <Transition name="fade">
    <p v-if="message" class="error">
      {{ $t(message) }}
    </p>
  </Transition>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue';

const message = defineModel<string>('message');

let timeout: ReturnType<typeof setTimeout> | undefined;

watch(
  message,
  (newValue) => {
    clearTimeout(timeout);

    if (newValue) {
      timeout = setTimeout(() => {
        message.value = '';
      }, 5000);
    }
  },
  { immediate: true }
);

onUnmounted(() => clearTimeout(timeout));
</script>
