<template>
  <main class="groceryList">
    <article>
      <GroceryListTitle
        v-model:delete-open="deleteGroceryListOpen"
        v-model:combine-ingredients="combineIngredients"
      />
      <Transition name="fade" mode="out-in">
        <LoadingSpinner
          v-if="
            groceryListStore.isLoadingAction('getGroceryList') &&
            !groceryListStore.groceryList.length
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
          <Transition name="fade" mode="out-in">
            <EmptyState
              v-if="groceryListStore.groceryList.length <= 0"
              key="empty"
              icon="basket-shopping"
              title="groceryListPage.emptyBasket"
              subtitle="groceryListPage.emptyBasketSubtitle"
              buttonText="groceryListPage.browseRecipes"
              buttonRoute="/recipes"
            />
            <div v-else :key="combineIngredients ? 'combined' : 'byRecipe'" class="groups">
              <TransitionGroup name="list">
                <IngredientListCard
                  v-for="group in groups"
                  :key="group.key"
                  :title="group.title"
                  :ingredients="group.ingredients"
                />
              </TransitionGroup>
            </div>
          </Transition>
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
import { type GroceryListEntry, type GroceryListGroup } from '@/utils/types/groceryList';
import { convertAmount, getUnitGroup, roundAmount } from '@/utils/recipe/updateIngredientUnit';

const OTHER_GROUP_KEY = 'other';
const COMBINED_GROUP_KEY = 'combined';

const groceryListStore = useGroceryListStore();
const { t } = useI18n();

const combineIngredients = ref<boolean>(false);
const deleteGroceryListOpen = ref<boolean>(false);

groceryListStore.getGroceryList();

/**
 * Grocery list grouped by the recipe the ingredients were added from. Ingredients that were added
 * by hand, or whose recipe was deleted, are grouped last.
 * @returns A group for every recipe
 */
function groupByRecipe(): GroceryListGroup[] {
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

    byRecipe.get(key)!.ingredients.push({ ...item, ids: [item.id] });
  }

  return [...byRecipe.values()].sort(
    (a, b) => Number(a.key === OTHER_GROUP_KEY) - Number(b.key === OTHER_GROUP_KEY)
  );
}

/**
 * Grocery list as one group, where ingredients with the same name are added up. Amounts are
 * converted to the unit of the first ingredient with that name, and ingredients whose units cannot
 * be converted into each other, like pieces and grams, stay separate.
 * @returns One group with all ingredients
 */
function groupCombined(): GroceryListGroup[] {
  const byIngredient = new Map<string, GroceryListEntry>();

  for (const item of groceryListStore.groceryList) {
    const key = `${item.name.trim().toLocaleLowerCase()}|${getUnitGroup(item.unit)}`;
    const combined = byIngredient.get(key);

    if (combined) {
      combined.amount = roundAmount(
        combined.amount + convertAmount(item.amount, item.unit, combined.unit)
      );
      combined.ids.push(item.id);
    } else {
      byIngredient.set(key, { ...item, ids: [item.id] });
    }
  }

  return [
    {
      key: COMBINED_GROUP_KEY,
      title: t('groceryListPage.allIngredients'),
      ingredients: [...byIngredient.values()]
    }
  ];
}

const groups = computed<GroceryListGroup[]>(() => {
  if (!groceryListStore.groceryList.length) return [];

  return combineIngredients.value ? groupCombined() : groupByRecipe();
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
