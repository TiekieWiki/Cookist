<template>
  <article>
    <section :class="['timer', timer.isFinished ? 'finished' : '']">
      <font-awesome-icon :icon="['fas', 'stopwatch']" />
      <Button :type="ButtonType.BUTTON">
        <font-awesome-icon
          @click="timer.minutes = Math.max(timer.minutes - 1, 0)"
          :icon="['fas', 'minus']"
        />
      </Button>
      <InputField
        name="hours"
        :placeholder="$t('recipePage.placeholder.hours')"
        :ariaLabel="$t('recipePage.ariaLabel.hours')"
        :step="1"
        type="number"
        v-model:input="timer.hours"
      />
      :
      <InputField
        name="minutes"
        :placeholder="$t('recipePage.placeholder.minutes')"
        :ariaLabel="$t('recipePage.ariaLabel.minutes')"
        :step="1"
        type="number"
        v-model:input="timer.minutes"
      />
      :
      <InputField
        name="seconds"
        :placeholder="$t('recipePage.placeholder.seconds')"
        :ariaLabel="$t('recipePage.ariaLabel.seconds')"
        :step="1"
        type="number"
        v-model:input="timer.seconds"
      />
      <Button :type="ButtonType.BUTTON">
        <font-awesome-icon @click="timer.minutes++" :icon="['fas', 'plus']"
      /></Button>
      <Button @click="timer.isRunning = !timer.isRunning" :type="ButtonType.BUTTON">
        <font-awesome-icon v-if="timer.isRunning" :icon="['fas', 'pause']" />
        <font-awesome-icon v-else :icon="['fas', 'play']" />
      </Button>
    </section>
  </article>
</template>

<script lang="ts" setup>
import { useTimer } from '@/composables/useTimer';
import InputField from '@/components/form/InputField.vue';
import Button from '../form/Button.vue';
import { ButtonType } from '@/utils/types/enums';

// Initialize timer
const { timer } = useTimer();
</script>
