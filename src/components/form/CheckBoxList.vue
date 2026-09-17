<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}
    <div class="checkbox-list">
      <TransitionGroup name="list">
        <div v-for="(item, index) in items" :key="item.id ?? item.name" class="checkbox-list-item">
          <CheckBox
            :id="item.id"
            :variant="item.variant"
            :name="item.name"
            :label="item.label"
            :required="item.required"
            :disabled="item.disabled"
            :autocomplete="item.autocomplete"
            v-model:input="item.checked"
          />

          <slot name="item" :item="item" :index="index" />
        </div>
      </TransitionGroup>
    </div>
  </label>
</template>

<script setup lang="ts">
import type { CheckBoxListProps, CheckBoxProps } from '@/utils/types/form';
import CheckBox from './CheckBox.vue';

defineProps<CheckBoxListProps>();

const items = defineModel<CheckBoxProps[]>('items');
</script>
