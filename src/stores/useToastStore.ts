import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type ActionError } from '@/utils/global/errorHandling';

export interface Toast {
  id: number;
  type: 'error' | 'success';
  title: string;
  message?: string;
}

const DURATION = {
  error: 8000,
  success: 4000
};

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  let nextId = 0;
  const timeouts = new Map<number, ReturnType<typeof setTimeout>>();

  /**
   * Remove a toast
   * @param id Id of the toast
   */
  function dismissToast(id: number): void {
    clearTimeout(timeouts.get(id));
    timeouts.delete(id);
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  /**
   * Show a toast that disappears by itself. The same toast is shown only once at a time.
   * @param toast Type and translation keys of the toast
   */
  function showToast(toast: Omit<Toast, 'id'>): void {
    toasts.value
      .filter((shown) => shown.title === toast.title && shown.message === toast.message)
      .forEach((shown) => dismissToast(shown.id));

    const id = nextId++;

    toasts.value.push({ ...toast, id });
    timeouts.set(
      id,
      setTimeout(() => dismissToast(id), DURATION[toast.type])
    );
  }

  /**
   * Show a toast explaining which action failed and why
   * @param error What failed and why
   */
  function showActionError(error: ActionError): void {
    showToast({
      type: 'error',
      title: `general.errors.actions.${error.action}`,
      message: `general.errors.causes.${error.code}`
    });
  }

  return { toasts, showToast, showActionError, dismissToast };
});
