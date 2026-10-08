<template>
  <main class="groceryList">
    <article>
      <GroceryListTitle v-model:delete-open="deleteGroceryListOpen" />
      <IngredientListCard />
    </article>
  </main>
  <ConfirmPopUp
    v-model:open-pop-up="deleteGroceryListOpen"
    title="groceryListPage.emptyGroceryList"
    section="groceryListPage.confirmEmpty"
    cancel="general.actions.cancel"
    confirm="groceryListPage.empty"
    :loading="groceryListStore.isLoadingAction('deleteGroceryList')"
    :error="groceryListStore.errorFor('deleteGroceryList')"
    @confirm="deleteGroceryList()"
  />
</template>

<script setup lang="ts">
import IngredientListCard from '@/components/pages/grocery list/IngredientListCard.vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { ref, watch } from 'vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';
import GroceryListTitle from '@/components/pages/grocery list/GroceryListTitle.vue';

const groceryListStore = useGroceryListStore();

const deleteGroceryListOpen = ref<boolean>(false);

groceryListStore.getGroceryList();

/**
 * Delete grocery list. When it fails, the pop-up stays open and shows why.
 */
async function deleteGroceryList(): Promise<void> {
  if (await groceryListStore.deleteGroceryList()) {
    deleteGroceryListOpen.value = false;
  }
}

watch(deleteGroceryListOpen, (open) => {
  if (open) groceryListStore.clearError('deleteGroceryList');
});
</script>
