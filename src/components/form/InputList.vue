<template>
  <label :id="id" class="inputList" :class="[colAmount, { sortable }]">
    {{ required ? label + ' *' : label }}

    <TransitionGroup ref="list" tag="ul" name="list">
      <li v-for="(item, index) in items" :key="rowKey(item)">
        <Button
          v-if="sortable"
          class="dragHandle"
          :class="{ hidden: !isMovable(index) }"
          :disabled="!isMovable(index)"
          :aria-label="$t('general.ariaLabel.moveRow')"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          @keydown.up.prevent="moveWithKeyboard(index, index - 1)"
          @keydown.down.prevent="moveWithKeyboard(index, index + 1)"
        >
          <font-awesome-icon :icon="['fas', 'grip-vertical']" />
        </Button>
        <slot :index="index"></slot>
        <Button
          @click="deleteRow(items!, index, empty)"
          :aria-label="$t('general.ariaLabel.deleteRow')"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.MEDIUM"
        >
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </Button>
      </li>
    </TransitionGroup>
    <p v-if="sortable" class="announcement" aria-live="polite">{{ announcement }}</p>
    <FieldError :id="errorId" :message="error" announce />
  </label>
</template>

<script setup lang="ts">
import { deleteRow, moveItem } from '@/utils/global/list';
import Button from './Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import { type InputListProps } from '@/utils/types/form';
import { nextTick, ref, useId, useTemplateRef, type ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import FieldError from './FieldError.vue';
import { useSortableList } from '@/composables/useSortableList';

const props = defineProps<InputListProps>();

const items = defineModel<object[]>('items');

const errorId = useId();
const { t } = useI18n();
const list = useTemplateRef<ComponentPublicInstance>('list');
const announcement = ref<string>('');

const rowKeys = new WeakMap<object, number>();
let nextRowKey = 0;

function rowKey(item: object): number {
  if (!rowKeys.has(item)) {
    rowKeys.set(item, nextRowKey++);
  }

  return rowKeys.get(item)!;
}

/**
 * Get the list element that holds the rows
 * @returns The list element, once it is mounted
 */
function listElement(): HTMLElement | undefined {
  return list.value?.$el as HTMLElement | undefined;
}

/**
 * Get the last index a row can be moved to. The last row is the empty row to add a new item, which
 * always stays at the bottom.
 * @returns The last index a row can be moved to
 */
function lastMovableIndex(): number {
  return (items.value?.length ?? 0) - 2;
}

/**
 * Check whether a row can be moved
 * @param index Index of the row
 * @returns Whether the row can be moved
 */
function isMovable(index: number): boolean {
  return index <= lastMovableIndex();
}

/**
 * Move a row, keeping it above the empty row
 * @param from Current index of the row
 * @param to Index to move the row to
 */
function moveRow(from: number, to: number): void {
  if (!items.value) return;

  moveItem(items.value, from, Math.min(to, lastMovableIndex()));
}

/**
 * Move a row one place with the arrow keys, keep the focus on its handle and announce where it is
 * now for screen readers
 * @param from Current index of the row
 * @param to Index to move the row to
 */
async function moveWithKeyboard(from: number, to: number): Promise<void> {
  if (to < 0 || to > lastMovableIndex()) return;

  moveRow(from, to);
  announcement.value = t('general.ariaLabel.rowMoved', {
    position: to + 1,
    total: lastMovableIndex() + 1
  });

  await nextTick();
  listElement()?.querySelectorAll<HTMLElement>('.dragHandle')[to]?.focus();
}

if (props.sortable) {
  useSortableList(listElement, moveRow, '.dragHandle');
}
</script>
