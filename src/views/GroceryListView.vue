<template>
  <main class="groceryList">
    <article>
      <GroceryListTitle v-model:delete-open="deleteGroceryListOpen" />
      <Transition name="fade" mode="out-in">
        <LoadingSpinner
          v-if="
            groceryListStore.isLoadingAction('getGroceryList') && !groceryListStore.groceryList.length
          "
          key="loading"
        />
        <ErrorState
          v-else-if="groceryListStore.errorFor('getGroceryList')"
          key="error"
          :error="groceryListStore.errorFor('getGroceryList')!"
          @retry="groceryListStore.getGroceryList()"
        />
        <div v-else key="list" class="groups">
          <EmptyState
            v-if="groceryListStore.groceryList.length <= 0"
            icon="basket-shopping"
            title="groceryListPage.emptyBasket"
            subtitle="groceryListPage.emptyBasketSubtitle"
            buttonText="groceryListPage.browseRecipes"
            buttonRoute="/recipes"
          />
          <IngredientListCard
            v-for="group in groups"
            :key="group.key"
            :title="group.title"
            :ingredients="group.ingredients"
          />
          <AddIngredient class="card" />
        </div>
      </Transition>
    </article>
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
  </main>
</template>

<script setup lang="ts">
import IngredientListCard from '@/components/pages/grocery list/IngredientListCard.vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';
import GroceryListTitle from '@/components/pages/grocery list/GroceryListTitle.vue';
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import ErrorState from '@/components/general/ErrorState.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import AddIngredient from '@/components/pages/grocery list/AddIngredient.vue';
import { type GroceryListGroup } from '@/utils/types/groceryList';

const OTHER_GROUP_KEY = 'other';

const groceryListStore = useGroceryListStore();
const { t } = useI18n();

const deleteGroceryListOpen = ref<boolean>(false);

groceryListStore.getGroceryList();

/**
 * Grocery list grouped by the recipe the ingredients were added from. Ingredients that were added
 * by hand, or whose recipe was deleted, are grouped last.
 */
const groups = computed<GroceryListGroup[]>(() => {
  const byRecipe = new Map<string, GroceryListGroup>();

  for (const item of groceryListStore.groceryList) {
    const key = item.recipe_id ?? OTHER_GROUP_KEY;

    if (!byRecipe.has(key)) {
      byRecipe.set(key, {
        key,
        title: item.recipes?.name ?? t('groceryListPage.other'),
        ingredients: []
      });
    }

    byRecipe.get(key)!.ingredients.push(item);
  }

  return [...byRecipe.values()].sort(
    (a, b) => Number(a.key === OTHER_GROUP_KEY) - Number(b.key === OTHER_GROUP_KEY)
  );
});

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
