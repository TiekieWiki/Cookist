import { computed, ref, type ComputedRef } from 'vue';
import { toActionError, type ActionError } from '@/utils/global/errorHandling';
import { useToastStore } from '@/stores/useToastStore';

export interface ActionOptions<Args extends unknown[]> {
  id?: (...args: Args) => string | undefined;
  toast?: boolean;
}

/**
 * Track which actions of a store are running and why they last failed. An action can run for one
 * item, for example deleting one ingredient, so the UI can show loading for that item only.
 * @returns Loading and error state, and a wrapper that tracks an action
 */
export function useActions<Action extends string>(): {
  isLoading: ComputedRef<boolean>;
  isLoadingAction: (action: Action, id?: string) => boolean;
  errorFor: (action: Action, id?: string) => ActionError | undefined;
  clearError: (action: Action, id?: string) => void;
  clearErrors: () => void;
  trackAction: <Args extends unknown[]>(
    action: Action,
    run: (...args: Args) => Promise<void>,
    options?: ActionOptions<Args>
  ) => (...args: Args) => Promise<boolean>;
} {
  const pending = ref<Record<string, number>>({});
  const errors = ref<Record<string, ActionError>>({});

  const isLoading = computed<boolean>(() => Object.keys(pending.value).length > 0);

  /**
   * Get the key an action is stored under
   * @param action Action
   * @param id Item the action runs for
   * @returns The key
   */
  function keyFor(action: Action, id?: string): string {
    return id ? `${action}:${id}` : action;
  }

  /**
   * Check whether a key belongs to an action, for any item
   * @param key Key to check
   * @param action Action
   * @returns Whether the key belongs to the action
   */
  function isKeyOf(key: string, action: Action): boolean {
    return key === action || key.startsWith(`${action}:`);
  }

  /**
   * Check whether an action is running, for one item or for any item
   * @param action Action to check
   * @param id Item to check, leave out to check all items
   * @returns Whether the action is running
   */
  function isLoadingAction(action: Action, id?: string): boolean {
    if (id) return keyFor(action, id) in pending.value;

    return Object.keys(pending.value).some((key) => isKeyOf(key, action));
  }

  /**
   * Get why an action last failed, for one item or for any item
   * @param action Action to check
   * @param id Item to check, leave out to check all items
   * @returns What failed and why, or undefined when the last attempt did not fail
   */
  function errorFor(action: Action, id?: string): ActionError | undefined {
    if (id) return errors.value[keyFor(action, id)];

    return Object.entries(errors.value).find(([key]) => isKeyOf(key, action))?.[1];
  }

  /**
   * Forget why an action failed, for example when the form it belongs to is opened again
   * @param action Action to clear
   * @param id Item to clear, leave out to clear all items
   */
  function clearError(action: Action, id?: string): void {
    errors.value = Object.fromEntries(
      Object.entries(errors.value).filter(([key]) =>
        id ? key !== keyFor(action, id) : !isKeyOf(key, action)
      )
    );
  }

  /**
   * Forget all errors, for example after logging out
   */
  function clearErrors(): void {
    errors.value = {};
  }

  /**
   * Wrap an action so it is marked as running until it finishes. A failure is caught, logged and
   * stored for the UI, and shown as a toast when the action asks for it.
   * @param action Name of the action
   * @param run Action to run, which throws when it fails
   * @param options Item the action runs for, and whether to show failures as a toast
   * @returns The wrapped action, which resolves to whether it succeeded
   */
  function trackAction<Args extends unknown[]>(
    action: Action,
    run: (...args: Args) => Promise<void>,
    options: ActionOptions<Args> = {}
  ): (...args: Args) => Promise<boolean> {
    return async (...args: Args): Promise<boolean> => {
      const key = keyFor(action, options.id?.(...args));

      pending.value[key] = (pending.value[key] ?? 0) + 1;
      delete errors.value[key];

      try {
        await run(...args);
        return true;
      } catch (error) {
        const actionError = toActionError(action, error);
        errors.value[key] = actionError;

        if (options.toast) {
          useToastStore().showActionError(actionError);
        }

        return false;
      } finally {
        pending.value[key]--;

        if (pending.value[key] <= 0) {
          delete pending.value[key];
        }
      }
    };
  }

  return { isLoading, isLoadingAction, errorFor, clearError, clearErrors, trackAction };
}
