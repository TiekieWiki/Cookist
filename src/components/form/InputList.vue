<template>
  <label :id="id"
    >{{ label }}
    <div class="list">
      <div v-for="(item, index) in items" :key="index">
        <slot :index="index"></slot>
        <button @click="deleteRow(items!, index)" class="delete" type="button">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </div>
    </div>
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
