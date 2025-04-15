<template>
  <main class="cookGroups">
    <article>
      <button @click="addCookGroupOpen = !addCookGroupOpen" type="button">
        {{ $t('cookGroupsPage.addCookGroup') }}
      </button>
    </article>
  </main>
  <AddCookGroup v-if="addCookGroupOpen" @close-pop-up="addCookGroupOpen = !addCookGroupOpen" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AddCookGroup from '@/components/AddCookGroup.vue';

const addCookGroupOpen = ref<boolean>(false);
</script>
