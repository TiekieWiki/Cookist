<template>
  <div
    :id="id"
    class="checkbox-list-group"
    role="group"
    :aria-labelledby="label ? labelId : undefined"
  >
    <span v-if="label" :id="labelId" class="list-label">
      {{ required ? label + ' *' : label }}
    </span>

    <div class="checkbox-list">
      <TransitionGroup name="list">
        <div v-for="(item, index) in items" :key="itemKey(item)" class="checkbox-list-item">
          <CheckBox
            :id="item.id"
            :variant="item.variant"
            :name="item.name"
            :label="item.label"
            :required="item.required"
            :disabled="item.disabled"
            :autocomplete="item.autocomplete"
            v-model:input="checked[itemKey(item)]"
          />

          <slot name="item" :item="item" :index="index" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckBoxListProps, CheckBoxProps } from '@/utils/types/form';
import CheckBox from './CheckBox.vue';
import { ref, useId } from 'vue';

const props = defineProps<CheckBoxListProps>();

const labelId = useId();

/**
 * Get the key of an item, which stays the same when the items are recreated
 * @param item Item to get the key of
 * @returns {string} The id of the item, or its name when it has no id
 */
function itemKey(item: CheckBoxProps): string {
  return item.id ?? item.name;
}

const checked = ref<Record<string, boolean>>(
  Object.fromEntries(props.items.map((item) => [itemKey(item), !!item.checked]))
);
</script>
