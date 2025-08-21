<template>
  <main class="groceryList">
    <article>
      <section class="header">
        <h2>{{ $t('groceryListPage.title') }}</h2>
      </section>
    </article>
    <article v-if="groceryList?.ingredients.length === 0" class="noItems">
      <h3>{{ $t('groceryListPage.noItems') }}</h3>
    </article>
    <article v-else>
      <ul>
        <li v-for="item in groceryList?.ingredients" :key="item.name">
          {{ item.name }} - {{ item.amount }} {{ item.unit }}
        </li>
      </ul>
    </article>
    <article class="card newCard"></article>
  </main>
</template>

<script setup lang="ts">
import type { GroceryList } from '@/utils/types/groceryList';
import { ref } from 'vue';

const groceryList = ref<GroceryList>();
</script>
