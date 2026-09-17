<template>
  <label :id="id" class="inputList" :class="colAmount">
    {{ required ? label + ' *' : label }}

    <ul>
      <TransitionGroup name="list">
        <li v-for="(item, index) in items" :key="rowKey(item)">
          <slot :index="index"></slot>
          <Button
            @click="deleteRow(items!, index, empty)"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.TERTIARY"
            :size="Size.MEDIUM"
          >
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </Button>
        </li>
      </TransitionGroup>
    </ul>
  </label>
</template>

<script setup lang="ts">
import { deleteRow } from '@/utils/global/list';
import Button from './Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import { type InputListProps } from '@/utils/types/form';

defineProps<InputListProps>();

const items = defineModel<Object[]>('items');

const rowKeys = new WeakMap<Object, number>();
let nextRowKey = 0;

function rowKey(item: Object): number {
  if (!rowKeys.has(item)) {
    rowKeys.set(item, nextRowKey++);
  }

  return rowKeys.get(item)!;
}
</script>
