<template>
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
    <div v-else>
      <div class="emptyList" v-if="groceryListStore.groceryList.length <= 0">
        <EmptyState
          key="empty"
          icon="basket-shopping"
          title="groceryListPage.emptyBasket"
          subtitle="groceryListPage.emptyBasketSubtitle"
          buttonText="groceryListPage.browseRecipes"
          buttonRoute="/recipes"
        />
        <AddIngredient class="card" />
      </div>
      <div v-else key="list" class="card">
        <CheckBoxList :items="ingredients">
          <template #item="{ item, index }">
            <Button
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.TERTIARY"
              :aria-label="$t('groceryListPage.ariaLabel.deleteIngredient', { name: item.name })"
              :disabled="isUpdating(index)"
              :aria-busy="isUpdating(index)"
              @click="
                groceryListStore.deleteGroceryListIngredient(
                  groceryListStore.groceryList[index].id!
                )
              "
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </Button>
          </template>
        </CheckBoxList>
        <AddIngredient />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed } from 'vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import ErrorState from '@/components/general/ErrorState.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';
import AddIngredient from './AddIngredient.vue';

const groceryListStore = useGroceryListStore();

const ingredients = computed(() => toIngredientCheckBoxes(groceryListStore.groceryList));

/**
 * Check whether an ingredient is being updated or deleted
 * @param index Index of the ingredient in the grocery list
 * @returns Whether the ingredient is busy
 */
function isUpdating(index: number): boolean {
  const id = groceryListStore.groceryList[index]?.id;
  if (!id) return false;

  return groceryListStore.isLoadingAction('deleteGroceryListIngredient', id);
}
</script>
