import { onScopeDispose } from 'vue';

const BEEP_FREQUENCY = 880;
const BEEP_VOLUME = 0.3;
const BEEP_LENGTH = 0.15;
const BEEP_GAP = 0.1;
const BEEPS_PER_PATTERN = 3;
const PATTERN_GAP = 0.8;
const ALARM_DURATION = 30;

/**
 * Alarm sound for the kitchen timer. The beeps are scheduled on the audio clock as soon as the
 * timer starts, because that clock keeps exact time in background tabs, where intervals are slowed
 * down. Browsers only allow sound that the user started, so the audio has to be unlocked from the
 * click that starts the timer.
 * @returns Functions to unlock the sound, schedule the alarm and cancel it
 */
export function useTimerAlarm(): {
  unlock: () => void;
  schedule: (secondsFromNow: number) => void;
  cancel: () => void;
} {
  let context: AudioContext | undefined;
  let output: GainNode | undefined;

  /**
   * Create or resume the audio, which must happen in the handler of a click
   */
  function unlock(): void {
    if (!('AudioContext' in window)) return;

    context ??= new AudioContext();

    if (context.state === 'suspended') {
      context.resume();
    }
  }

  /**
   * Schedule the alarm, which beeps in groups of three until it is cancelled or has rung for half a
   * minute. A previously scheduled alarm is cancelled first.
   * @param secondsFromNow Seconds until the alarm should go off
   */
  function schedule(secondsFromNow: number): void {
    cancel();

    if (!context) return;

    output = context.createGain();
    output.gain.value = BEEP_VOLUME;
    output.connect(context.destination);

    const alarmStart = context.currentTime + secondsFromNow;
    const patternLength = BEEPS_PER_PATTERN * (BEEP_LENGTH + BEEP_GAP) + PATTERN_GAP;

    for (
      let patternStart = alarmStart;
      patternStart < alarmStart + ALARM_DURATION;
      patternStart += patternLength
    ) {
      for (let beep = 0; beep < BEEPS_PER_PATTERN; beep++) {
        const beepStart = patternStart + beep * (BEEP_LENGTH + BEEP_GAP);
        const oscillator = context.createOscillator();

        oscillator.frequency.value = BEEP_FREQUENCY;
        oscillator.connect(output);
        oscillator.start(beepStart);
        oscillator.stop(beepStart + BEEP_LENGTH);
      }
    }
  }

  /**
   * Silence the alarm, whether it is still waiting or already ringing
   */
  function cancel(): void {
    output?.disconnect();
    output = undefined;
  }

  onScopeDispose(() => {
    cancel();
    context?.close();
  });

  return { unlock, schedule, cancel };
}
