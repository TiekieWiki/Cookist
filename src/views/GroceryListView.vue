<template>
  <main class="groceryList">
    <article>
      <IngredientListCard v-model:delete-open="deleteGroceryListOpen" />
      <AddIngredientCard />
    </article>
  </main>
  <ConfirmPopUp
    v-model:open-pop-up="deleteGroceryListOpen"
    :title="$t('groceryListPage.emptyGroceryList')"
    :section="$t('groceryListPage.confirmEmpty')"
    :cancel="'groceryListPage.cancel'"
    :confirm="'groceryListPage.empty'"
    @confirm="deleteGroceryList()"
  />
</template>

<script setup lang="ts">
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import IngredientListCard from '@/components/grocery list/IngredientListCard.vue';
import AddIngredientCard from '@/components/grocery list/AddIngredientCard.vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { onMounted, ref } from 'vue';

const groceryListStore = useGroceryListStore();

const deleteGroceryListOpen = ref<boolean>(false);

onMounted(() => {
  groceryListStore.getGroceryList();
});

/**
 * Delete grocery list
 */
function deleteGroceryList(): void {
  deleteGroceryListOpen.value = false;
  groceryListStore.deleteGroceryList();
}
</script>
