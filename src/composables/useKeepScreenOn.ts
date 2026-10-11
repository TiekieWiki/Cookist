import { onScopeDispose, ref, watch } from 'vue';

/**
 * Keep the screen on composable. The browser releases the wake lock when the page is hidden, so it
 * is requested again when the page becomes visible. When the browser denies or ends the wake lock
 * while the page is visible, for example in battery saver mode, the toggle is turned off.
 * @returns Whether the browser supports keeping the screen on, and a ref to control whether the
 * screen should stay on.
 */
export function useKeepScreenOn() {
  const isSupported = 'wakeLock' in navigator && window.isSecureContext;
  const keepScreenOn = ref(false);
  let wakeLock: WakeLockSentinel | null = null;

  /**
   * Turn the toggle off when the browser ends the wake lock while the page is visible. A release
   * because the page is hidden is ignored, so the lock is requested again when it becomes visible.
   * @param sentinel The released wake lock
   */
  function onWakeLockRelease(sentinel: WakeLockSentinel): void {
    if (wakeLock !== sentinel) return;

    wakeLock = null;

    if (document.visibilityState === 'visible') {
      keepScreenOn.value = false;
    }
  }

  /**
   * Request a wake lock, when the browser supports it
   */
  async function requestWakeLock(): Promise<void> {
    if (!isSupported) return;

    try {
      const sentinel = await navigator.wakeLock.request('screen');

      if (keepScreenOn.value) {
        wakeLock = sentinel;
        sentinel.addEventListener('release', () => onWakeLockRelease(sentinel));
      } else {
        await sentinel.release();
      }
    } catch (error) {
      console.error('Error requesting Wake Lock:', error);
      keepScreenOn.value = false;
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

  return { isSupported, keepScreenOn };
}
