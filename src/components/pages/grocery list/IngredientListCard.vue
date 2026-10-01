<template>
  <Transition name="fade" mode="out-in">
    <LoadingSpinner
      v-if="
        groceryListStore.isLoadingAction('getGroceryList') && !groceryListStore.groceryList.length
      "
      key="loading"
    />
    <EmptyState
      v-else-if="groceryListStore.groceryList.length <= 0"
      key="empty"
      icon="basket-shopping"
      title="groceryListPage.emptyBasket"
      subtitle="groceryListPage.emptyBasketSubtitle"
      buttonText="groceryListPage.browseRecipes"
      buttonRoute="/"
    />
    <div v-else key="list" class="card">
      <CheckBoxList :items="ingredients">
        <template #item="{ item, index }">
          <SelectField
            :ariaLabel="$t('general.recipe.ariaLabel.unit')"
            :placeholder="$t('general.recipe.placeholder.unit')"
            :items="toSelectOptions(getPossibleUnits(item.slot!))"
            labelPrefix="general.recipe.units."
            :disabled="isUpdating(index)"
            v-model:selected="item.slot"
            @change="changeIngredientUnit(item, index)"
          />
          <p>{{ item.name }}</p>
          <Button
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.TERTIARY"
            :aria-label="$t('groceryListPage.ariaLabel.deleteIngredient', { name: item.name })"
            :disabled="isUpdating(index)"
            :aria-busy="isUpdating(index)"
            @click="
              groceryListStore.deleteGroceryListIngredient(groceryListStore.groceryList[index].id!)
            "
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </Button>
        </template>
      </CheckBoxList>
      <div class="addIngredient">
        <IngredientInputRow name="new-ingredient" v-model:ingredient="ingredient" />
        <Button
          @click="groceryListStore.setGroceryList(ingredient)"
          :aria-label="$t('groceryListPage.addIngredient')"
          :disabled="groceryListStore.isLoadingAction('setGroceryList')"
          :aria-busy="groceryListStore.isLoadingAction('setGroceryList')"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.PRIMARY"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span class="desktop">{{ $t('groceryListPage.addIngredient') }}</span>
        </Button>
      </div>
      <ErrorMessage v-model:message="groceryListStore.errorMessage" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { getPossibleUnits, updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed, ref } from 'vue';
import { type CheckBoxProps } from '@/utils/types/form';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { emptyIngredient, type Ingredient } from '@/utils/types/recipe';
import EmptyState from '@/components/general/EmptyState.vue';
import IngredientInputRow from '@/components/general/IngredientInputRow.vue';
import { toSelectOptions } from '@/utils/global/selectOptions';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';

const ingredient = ref<Ingredient>(emptyIngredient());

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

  return (
    groceryListStore.isLoadingAction('setGroceryListIngredient', id) ||
    groceryListStore.isLoadingAction('deleteGroceryListIngredient', id)
  );
}

/**
 * Change the unit of an ingredient in the grocery list
 * @param ingredient Ingredient to update
 */
function changeIngredientUnit(ingredient: CheckBoxProps, index: number): void {
  const updatedIngredient = updateIngredientUnit(groceryListStore.groceryList[index], {
    ...groceryListStore.groceryList[index],
    unit: ingredient.slot ? ingredient.slot : ''
  });
  groceryListStore.setGroceryListIngredient(updatedIngredient);
}
</script>
