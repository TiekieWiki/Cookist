import { computed, ref, type ComputedRef } from 'vue';

/**
 * Track which actions of a store are running. An action can run for one item, for example deleting
 * one ingredient, so the UI can show loading for that item only.
 * @returns Loading state and a wrapper that tracks an action
 */
export function useLoading<Action extends string>(): {
  isLoading: ComputedRef<boolean>;
  isLoadingAction: (action: Action, id?: string) => boolean;
  trackLoading: <Args extends unknown[], Result>(
    action: Action,
    run: (...args: Args) => Promise<Result>,
    getId?: (...args: Args) => string | undefined
  ) => (...args: Args) => Promise<Result>;
} {
  const pending = ref<Record<string, number>>({});

  const isLoading = computed<boolean>(() => Object.keys(pending.value).length > 0);

  /**
   * Check whether an action is running, for one item or for any item
   * @param action Action to check
   * @param id Item to check, leave out to check all items
   * @returns Whether the action is running
   */
  function isLoadingAction(action: Action, id?: string): boolean {
    if (id) return `${action}:${id}` in pending.value;

    return Object.keys(pending.value).some((key) => key === action || key.startsWith(`${action}:`));
  }

  /**
   * Wrap an action so it is marked as running until it finishes, also when it fails
   * @param action Name of the action
   * @param run Action to run
   * @param getId Get the item the action runs for from its arguments
   * @returns The wrapped action
   */
  function trackLoading<Args extends unknown[], Result>(
    action: Action,
    run: (...args: Args) => Promise<Result>,
    getId?: (...args: Args) => string | undefined
  ): (...args: Args) => Promise<Result> {
    return async (...args: Args): Promise<Result> => {
      const id = getId?.(...args);
      const key = id ? `${action}:${id}` : action;

      pending.value[key] = (pending.value[key] ?? 0) + 1;

      try {
        return await run(...args);
      } finally {
        pending.value[key]--;

        if (pending.value[key] <= 0) {
          delete pending.value[key];
        }
      }
    };
  }

  return { isLoading, isLoadingAction, trackLoading };
}
