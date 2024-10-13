<template>
  <label :id="id">
    {{ label }}
    <div class="label-group">
      <check-box
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
import type { Checkbox } from '@/utils/types/form';
import CheckBox from './CheckBox.vue';

defineProps<{
  id?: string;
  label?: string;
}>();

const items = defineModel<Checkbox[]>('items');
</script>
