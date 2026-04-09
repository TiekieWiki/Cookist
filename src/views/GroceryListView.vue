<template>
  <main class="groceryList">
    <article>
      <section class="header">
        <h2>{{ $t('groceryListPage.title') }}</h2>
      </section>
    </article>
    <IngredientListCard />
    <AddIngredientCard />
  </main>
  <ConfirmPopUp
    :title="$t('groceryListPage.emptyGroceryList')"
    :section="$t('groceryListPage.confirmEmpty')"
    :cancel="'groceryListPage.cancel'"
    :confirm="'groceryListPage.empty'"
    v-model:open-pop-up="emptyGroceryListOpen"
    @confirm="emptyGroceryList()"
  />
</template>

<script setup lang="ts">
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import { useGroceryList } from '@/composables/useGroceryList';
import IngredientListCard from '@/components/grocery list/IngredientListCard.vue';
import AddIngredientCard from '@/components/grocery list/AddIngredientCard.vue';

const { emptyGroceryListOpen, emptyGroceryList } = useGroceryList();
</script>
