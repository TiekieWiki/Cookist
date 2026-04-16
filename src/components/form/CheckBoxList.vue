<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}
    <div class="checkbox-list">
      <CheckBox
        v-for="(item, index) in items"
        :key="index"
        :id="item.id"
        :name="item.name"
        :label="item.label"
        :required="item.required"
        :disabled="item.disabled"
        :autocomplete="item.autocomplete"
        v-model:input="item.checked"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import type { CheckBoxListProps, CheckBoxProps } from '@/utils/types/form';
import CheckBox from './CheckBox.vue';

defineProps<CheckBoxListProps>();

const items = defineModel<CheckBoxProps[]>('items');
</script>
