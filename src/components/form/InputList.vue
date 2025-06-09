<template>
  <label :id="id"
    >{{ label }}
    <ul class="list">
      <li v-for="(item, index) in items" :key="index">
        <slot :index="index"></slot>
        <button @click="deleteRow(items!, index)" class="delete" type="button">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </li>
    </ul>
  </label>
</template>

<script setup lang="ts">
import { deleteRow } from '@/utils/recipe/list';

defineProps<{
  id?: string;
  label?: string;
}>();

const items = defineModel<Object[]>('items');
</script>
