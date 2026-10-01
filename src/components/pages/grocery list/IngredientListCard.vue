<template>
  <Transition name="fade" mode="out-in">
    <EmptyState
      v-if="groceryListStore.groceryList.length <= 0"
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
            :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
            :placeholder="$t('editRecipePage.placeholder.unit')"
            :items="toSelectOptions(getPossibleUnits(item.slot!))"
            labelPrefix="editRecipePage.units."
            v-model:selected="item.slot"
            @change="changeIngredientUnit(item, index)"
          />
          <p>{{ item.name }}</p>
          <Button
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.TERTIARY"
            :aria-label="$t('groceryListPage.ariaLabel.deleteIngredient', { name: item.name })"
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
