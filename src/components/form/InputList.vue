<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}

    <ul class="list">
      <li v-for="(item, index) in items" :key="index">
        <slot :index="index"></slot>
        <Button @click="deleteRow(items!, index, empty)" :type="ButtonType.BUTTON">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </Button>
      </li>
    </ul>
  </label>
</template>

<script setup lang="ts">
import { deleteRow } from '@/utils/global/list';
import Button from './Button.vue';
import { ButtonType } from '@/utils/types/enums';

defineProps<{
  id?: string;
  label?: string;
  required?: boolean;
  empty?: boolean;
}>();

const items = defineModel<Object[]>('items');
</script>
