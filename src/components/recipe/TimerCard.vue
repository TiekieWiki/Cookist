<template>
  <section class="timer card">
    <p><font-awesome-icon :icon="['fas', 'stopwatch']" />{{ $t('recipePage.kitchenTimer') }}</p>
    <div
      class="clock"
      :class="{ finished: runningTimer.isFinished }"
      :style="{ '--progress': `${progress}%` }"
    >
      <span v-if="runningTimer.hours"
        >{{ runningTimer.hours >= 10 ? runningTimer.hours : `0${runningTimer.hours}` }}:</span
      ><span
        >{{ runningTimer.minutes >= 10 ? runningTimer.minutes : `0${runningTimer.minutes}` }}:</span
      ><span>{{
        runningTimer.seconds >= 10 ? runningTimer.seconds : `0${runningTimer.seconds}`
      }}</span>
    </div>
    <div class="actions">
      <Button @click="runningTimer.isRunning = !runningTimer.isRunning" :type="ButtonType.BUTTON">
        <template v-if="runningTimer.isRunning">
          <font-awesome-icon :icon="['fas', 'pause']" />{{ $t('recipePage.pause') }}
        </template>
        <template v-else
          ><font-awesome-icon :icon="['fas', 'play']" />{{ $t('recipePage.start') }}</template
        >
      </Button>
      <Button :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY" @click="resetTimer">
        <font-awesome-icon :icon="['fas', 'rotate-left']" />
      </Button>
    </div>
    <div class="setTime">
      <Button
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.SECONDARY"
        @click="time.minutes = Math.max(time.minutes - 1, 0)"
      >
        <font-awesome-icon :icon="['fas', 'minus']" />
      </Button>
      <InputField
        name="hours"
        :placeholder="$t('recipePage.placeholder.hours')"
        :ariaLabel="$t('recipePage.ariaLabel.hours')"
        :step="1"
        type="number"
        v-model:input="time.hours"
      />
      <p>:</p>
      <InputField
        name="minutes"
        :placeholder="$t('recipePage.placeholder.minutes')"
        :ariaLabel="$t('recipePage.ariaLabel.minutes')"
        :step="1"
        type="number"
        v-model:input="time.minutes"
      />
      <p>:</p>
      <InputField
        name="seconds"
        :placeholder="$t('recipePage.placeholder.seconds')"
        :ariaLabel="$t('recipePage.ariaLabel.seconds')"
        :step="1"
        type="number"
        v-model:input="time.seconds"
      />
      <Button :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY" @click="time.minutes++">
        <font-awesome-icon :icon="['fas', 'plus']"
      /></Button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useTimer } from '@/composables/useTimer';
import InputField from '@/components/form/InputField.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';

const { time, runningTimer, progress, resetTimer } = useTimer();
</script>
