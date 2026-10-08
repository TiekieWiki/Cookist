<template>
  <Transition name="fade">
    <p v-if="error" class="status error" role="alert">
      <strong>{{ $t(`general.errors.actions.${error.action}`) }}</strong>
      {{ $t(`general.errors.causes.${error.code}`) }}
    </p>
  </Transition>
</template>

<script setup lang="ts">
import { type ActionError } from '@/utils/global/errorHandling';

defineProps<{ error?: ActionError | null }>();
</script>
