import { onScopeDispose, ref, watch } from 'vue';

/**
 * Keep the screen on composable. The browser releases the wake lock when the page is hidden, so it
 * is requested again when the page becomes visible.
 * @returns An object containing a ref to control whether the screen should stay on.
 */
export function useKeepScreenOn() {
  const keepScreenOn = ref(false);
  let wakeLock: WakeLockSentinel | null = null;

  /**
   * Request a wake lock, when the browser supports it
   */
  async function requestWakeLock(): Promise<void> {
    if (!('wakeLock' in navigator)) return;

    try {
      const sentinel = await navigator.wakeLock.request('screen');

      if (keepScreenOn.value) {
        wakeLock = sentinel;
      } else {
        await sentinel.release();
      }
    } catch (error) {
      console.error('Error requesting Wake Lock:', error);
    }
  }

  /**
   * Release the current wake lock
   */
  async function releaseWakeLock(): Promise<void> {
    const sentinel = wakeLock;
    wakeLock = null;

    try {
      await sentinel?.release();
    } catch (error) {
      console.error('Error releasing Wake Lock:', error);
    }
  }

  /**
   * Request the wake lock again when the page becomes visible
   */
  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible' && keepScreenOn.value) {
      requestWakeLock();
    }
  }

  watch(keepScreenOn, (isOn) => {
    if (isOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  });

  document.addEventListener('visibilitychange', onVisibilityChange);

  onScopeDispose(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    releaseWakeLock();
  });

  return { keepScreenOn };
}
