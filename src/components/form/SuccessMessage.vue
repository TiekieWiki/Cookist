<template>
  <Transition name="fade">
    <p v-if="message" class="success">
      {{ $t(message) }}
    </p>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const message = defineModel<string>('message');

watch(message, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      message.value = '';
    }, 5000);
  }
});
</script>
