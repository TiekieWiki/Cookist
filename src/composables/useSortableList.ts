import Sortable from 'sortablejs';
import { nextTick, onMounted, onScopeDispose } from 'vue';

/**
 * Make the rows of a list sortable with drag and drop, also on touch screens. SortableJS moves the
 * dragged element itself, so that move is undone and only reported, which keeps Vue in charge of the
 * DOM. While Vue puts the row in its new place, the list gets the `sorting` class, so its move
 * transition can be turned off and the dropped row does not slide back from its old place.
 * @param getElement Function that returns the element whose children are the rows
 * @param onMove Called with the old and new index of the dropped row, to move it in the data
 * @param handle Selector of the element a row can be dragged by
 */
export function useSortableList(
  getElement: () => HTMLElement | undefined,
  onMove: (oldIndex: number, newIndex: number) => void,
  handle: string
): void {
  let sortable: Sortable | undefined;

  onMounted(() => {
    const element = getElement();
    if (!element) return;

    sortable = Sortable.create(element, {
      handle,
      animation: 150,
      onEnd: async ({ item, from, oldIndex, newIndex }) => {
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;

        item.remove();
        from.insertBefore(item, from.children[oldIndex] ?? null);

        from.classList.add('sorting');
        onMove(oldIndex, newIndex);

        await nextTick();
        from.classList.remove('sorting');
      }
    });
  });

  onScopeDispose(() => sortable?.destroy());
}
