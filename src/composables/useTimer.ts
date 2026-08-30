import type { Time, Timer } from '@/utils/types/timer';
import { computed, ref, watch, type Ref } from 'vue';

/**
 * Timer composable that manages a simple timer state.
 * @returns An object containing the timer state and functions to control it.
 */
export function useTimer(): {
  time: Ref<Time>;
  runningTimer: Ref<Timer>;
  progress: Ref<number>;
  resetTimer: () => void;
} {
  const time = ref<Time>({
    hours: 0,
    minutes: 1,
    seconds: 0,
  });

  const runningTimer = ref<Timer>({
    hours: time.value.hours,
    minutes: time.value.minutes,
    seconds: time.value.seconds,
    isRunning: false,
    isFinished: false
  });

  /**
   * Starts the timer.
   */
  function startTimer(): void {
    runningTimer.value.isRunning = true;
    runningTimer.value.isFinished = false;
  }

  /**
   * Pauses the timer.
   */
  function pauseTimer(): void {
    runningTimer.value.isRunning = false;
  }

  /**
   * Resets the timer.
   */
  function resetTimer(): void {
    runningTimer.value.hours = time.value.hours;
    runningTimer.value.minutes = time.value.minutes;
    runningTimer.value.seconds = time.value.seconds;
    runningTimer.value.isRunning = false;
    runningTimer.value.isFinished = false;
  }

  /**
   * Get the progress of the timer.
   */
  const progress = computed(() => {
    const total = time.value.hours * 3600 + time.value.minutes * 60 + time.value.seconds;
    const current = runningTimer.value.hours * 3600 + runningTimer.value.minutes * 60 + runningTimer.value.seconds;

    return current / total * 100;
  })

  // Watch for time changes to update the running time
  watch(
    time,
    (newTime) => {
      if (!runningTimer.value.isRunning) {
        runningTimer.value.hours = newTime.hours;
        runningTimer.value.minutes = newTime.minutes;
        runningTimer.value.seconds = newTime.seconds;
      }
    },
    { deep: true }
  );

  // Watch for changes in the timer's isRunning state to update the timer
  let interval: ReturnType<typeof setInterval> | null = null;
  watch(
    () => runningTimer.value.isRunning,
    (isRunning) => {
      if (isRunning) {
        interval = setInterval(() => {
          if (runningTimer.value.hours === 0 && runningTimer.value.minutes === 0 && runningTimer.value.seconds === 0) {
            runningTimer.value.isRunning = false;
            runningTimer.value.isFinished = true;
            return;
          }
          if (runningTimer.value.seconds > 0) {
            runningTimer.value.seconds--;
          } else {
            if (runningTimer.value.minutes > 0) {
              runningTimer.value.minutes--;
              runningTimer.value.seconds = 59;
            } else if (runningTimer.value.hours > 0) {
              runningTimer.value.hours--;
              runningTimer.value.minutes = 59;
              runningTimer.value.seconds = 59;
            }
          }
        }, 1000);
        startTimer();
      } else if (interval) {
        clearInterval(interval);
        interval = null;
        pauseTimer();
      }
    }
  );

  return { time, runningTimer, progress, resetTimer };
}
