import type { Timer } from '@/utils/types/timer';
import { ref, watch, type Ref } from 'vue';

/**
 * Timer composable that manages a simple timer state.
 * @returns An object containing the timer state and functions to control it.
 */
export function useTimer(): {
  timer: Ref<Timer>;
  startTimer: () => void;
  pauseTimer: () => void;
} {
  const timer = ref<Timer>({
    hours: 0,
    minutes: 1,
    seconds: 0,
    isRunning: false,
    isFinished: false
  });

  /**
   * Starts the timer.
   */
  function startTimer(): void {
    timer.value.isRunning = true;
    timer.value.isFinished = false;
  }

  /**
   * Pauses the timer.
   */
  function pauseTimer(): void {
    timer.value.isRunning = false;
  }

  // Watch for changes in the timer's isRunning state to update the timer
  let interval: ReturnType<typeof setInterval> | null = null;
  watch(
    () => timer.value.isRunning,
    (isRunning) => {
      if (isRunning) {
        interval = setInterval(() => {
          if (timer.value.hours === 0 && timer.value.minutes === 0 && timer.value.seconds === 0) {
            timer.value.isRunning = false;
            timer.value.isFinished = true;
            return;
          }
          if (timer.value.seconds > 0) {
            timer.value.seconds--;
          } else {
            if (timer.value.minutes > 0) {
              timer.value.minutes--;
              timer.value.seconds = 59;
            } else if (timer.value.hours > 0) {
              timer.value.hours--;
              timer.value.minutes = 59;
              timer.value.seconds = 59;
            }
          }
        }, 1000);
      } else if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  );

  return { timer, startTimer, pauseTimer };
}
