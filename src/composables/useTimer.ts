import type { Time, Timer } from '@/utils/types/timer';
import { computed, onScopeDispose, ref, watch, type Ref } from 'vue';
import { useKeepScreenOn } from './useKeepScreenOn';
import { useTimerAlarm } from './useTimerAlarm';

/**
 * Converts a time to seconds
 * @param time Time to convert
 * @returns {number} Total amount of seconds
 */
function toSeconds(time: Time): number {
  const hours = Number(time.hours) || 0;
  const minutes = Number(time.minutes) || 0;
  const seconds = Number(time.seconds) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Timer composable that manages a simple timer state. The remaining time is calculated from the
 * end time, so the timer stays correct when the browser slows down intervals in background tabs.
 * While the timer runs, the screen stays on, so a phone keeps running the page, and an alarm sounds
 * when the time is up.
 * @returns An object containing the timer state and functions to control it.
 */
export function useTimer(): {
  time: Ref<Time>;
  runningTimer: Ref<Timer>;
  progress: Ref<number>;
  resetTimer: () => void;
  unlockAlarm: () => void;
} {
  const alarm = useTimerAlarm();
  const { keepScreenOn } = useKeepScreenOn();

  const time = ref<Time>({
    hours: 0,
    minutes: 1,
    seconds: 0
  });

  const runningTimer = ref<Timer>({
    ...time.value,
    isRunning: false,
    isFinished: false
  });

  let endTime = 0;
  let interval: ReturnType<typeof setInterval> | undefined;

  /**
   * Sets the remaining time of the running timer
   * @param totalSeconds Remaining amount of seconds
   */
  function setRemainingTime(totalSeconds: number): void {
    runningTimer.value.hours = Math.floor(totalSeconds / 3600);
    runningTimer.value.minutes = Math.floor((totalSeconds % 3600) / 60);
    runningTimer.value.seconds = totalSeconds % 60;
  }

  /**
   * Updates the remaining time and finishes the timer when no time is left
   */
  function tick(): void {
    const remainingSeconds = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);

    setRemainingTime(remainingSeconds);

    if (remainingSeconds === 0) {
      runningTimer.value.isRunning = false;
      runningTimer.value.isFinished = true;
    }
  }

  /**
   * Stops the interval of the timer
   */
  function stopInterval(): void {
    clearInterval(interval);
    interval = undefined;
  }

  /**
   * Resets the timer, which also silences the alarm
   */
  function resetTimer(): void {
    alarm.cancel();
    runningTimer.value.isRunning = false;
    runningTimer.value.isFinished = false;
    setRemainingTime(toSeconds(time.value));
  }

  /**
   * Get the progress of the timer.
   */
  const progress = computed(() => {
    const total = toSeconds(time.value);

    if (total === 0) return 0;

    return (toSeconds(runningTimer.value) / total) * 100;
  });

  watch(
    time,
    (newTime) => {
      if (!runningTimer.value.isRunning) {
        setRemainingTime(toSeconds(newTime));
      }
    },
    { deep: true }
  );

  watch(
    () => runningTimer.value.isRunning,
    (isRunning) => {
      stopInterval();
      keepScreenOn.value = isRunning;

      if (isRunning) {
        const remainingSeconds = toSeconds(runningTimer.value);

        runningTimer.value.isFinished = false;
        endTime = Date.now() + remainingSeconds * 1000;
        alarm.schedule(remainingSeconds);
        tick();
        interval = setInterval(tick, 250);
      } else if (!runningTimer.value.isFinished) {
        alarm.cancel();
      }
    }
  );

  onScopeDispose(stopInterval);

  return { time, runningTimer, progress, resetTimer, unlockAlarm: alarm.unlock };
}
