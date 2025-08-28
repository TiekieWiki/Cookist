<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}

    <ul class="list">
      <li v-for="(item, index) in items" :key="index">
        <slot :index="index"></slot>
        <button @click="deleteRow(items!, index, empty)" class="delete" type="button">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </li>
    </ul>
  </label>
</template>

<script setup lang="ts">
import { deleteRow } from '@/utils/global/list';

defineProps<{
  id?: string;
  label?: string;
  required?: boolean;
  empty?: boolean;
}>();

const items = defineModel<Object[]>('items');
</script>
