<template>
  <article>
    <section class="header" :class="['timer', timer.isFinished ? 'finished' : '']">
      <font-awesome-icon class="edit" :icon="['fas', 'stopwatch']" />
      <font-awesome-icon
        @click="timer.minutes = Math.max(timer.minutes - 1, 0)"
        class="edit"
        :icon="['fas', 'minus']"
      />
      <input-field
        name="hours"
        :placeholder="$t('recipePage.placeholder.hours')"
        :ariaLabel="$t('recipePage.ariaLabel.hours')"
        :step="1"
        type="number"
        v-model:input="timer.hours"
      />
      :
      <input-field
        name="minutes"
        :placeholder="$t('recipePage.placeholder.minutes')"
        :ariaLabel="$t('recipePage.ariaLabel.minutes')"
        :step="1"
        type="number"
        v-model:input="timer.minutes"
      />
      :
      <input-field
        name="seconds"
        :placeholder="$t('recipePage.placeholder.seconds')"
        :ariaLabel="$t('recipePage.ariaLabel.seconds')"
        :step="1"
        type="number"
        v-model:input="timer.seconds"
      />
      <font-awesome-icon @click="timer.minutes++" class="edit" :icon="['fas', 'plus']" />
      <button @click="timer.isRunning = !timer.isRunning" class="icon" type="button">
        <font-awesome-icon v-if="timer.isRunning" :icon="['fas', 'pause']" />
        <font-awesome-icon v-else :icon="['fas', 'play']" />
      </button>
    </section>
  </article>
</template>

<script lang="ts" setup>
import { useTimer } from '@/composables/useTimer';
import InputField from '@/components/form/InputField.vue';

// Initialize timer
const { timer } = useTimer();
</script>
