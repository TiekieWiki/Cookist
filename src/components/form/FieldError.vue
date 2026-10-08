<template>
  <Transition name="fade">
    <p v-if="message" :id="id" class="fieldError" :role="announce ? 'alert' : undefined">
      {{ $t(message) }}
    </p>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ id: string; message?: string; announce?: boolean }>();
</script>
