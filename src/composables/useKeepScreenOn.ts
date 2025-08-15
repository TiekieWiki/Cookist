import { ref, watch } from 'vue';

/**
 * Keep the screen on composable.
 * @returns An object containing a ref to control whether the screen should stay on.
 */
export function useKeepScreenOn() {
  const keepScreenOn = ref(false);
  let wakeLock: WakeLockSentinel | null = null;

  watch(keepScreenOn, async () => {
    if (keepScreenOn.value) {
      navigator.wakeLock
        .request('screen')
        .then((sentinel) => {
          wakeLock = sentinel;
        })
        .catch((error) => {
          console.error('Error requesting Wake Lock:', error);
        });
    } else {
      if (!wakeLock) {
        return;
      }
      wakeLock
        .release()
        .then(() => {
          wakeLock = null;
        })
        .catch((error) => {
          console.error('Error releasing Wake Lock:', error);
        });
    }
  });

  return { keepScreenOn };
}
