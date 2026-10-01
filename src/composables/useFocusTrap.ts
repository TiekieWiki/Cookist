import { nextTick, onScopeDispose, watch, type Ref } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Keep keyboard focus inside a container while it is open, close it on Escape and give focus back
 * to the element that opened it once it closes
 * @param container Element to keep focus in
 * @param isOpen Whether the container is open, set to false on Escape
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  isOpen: Ref<boolean | undefined>
): void {
  let previousFocus: HTMLElement | null = null;

  /**
   * Get the elements inside the container that can receive focus
   * @returns Focusable elements
   */
  function getFocusableElements(): HTMLElement[] {
    return Array.from(container.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
  }

  /**
   * Close on Escape and wrap Tab around the first and last focusable element
   * @param event Keyboard event
   */
  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      isOpen.value = false;
      return;
    }

    if (event.key !== 'Tab') return;

    const elements = getFocusableElements();
    if (!elements.length) {
      event.preventDefault();
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;
    const focusOutside = !container.value?.contains(active);

    if (event.shiftKey && (active === first || focusOutside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || focusOutside)) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null;
      document.addEventListener('keydown', onKeydown);

      await nextTick();
      getFocusableElements()[0]?.focus();
    } else {
      document.removeEventListener('keydown', onKeydown);
      previousFocus?.focus();
      previousFocus = null;
    }
  });

  onScopeDispose(() => {
    document.removeEventListener('keydown', onKeydown);
  });
}
