<template>
  <main class="groceryList">
    <article>
      <GroceryListTitle v-model:delete-open="deleteGroceryListOpen" />
      <IngredientListCard />
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
import IngredientListCard from '@/components/grocery list/IngredientListCard.vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { onMounted, ref } from 'vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';
import GroceryListTitle from '@/components/grocery list/GroceryListTitle.vue';

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
