<template>
  <section class="ingredients card">
    <div class="title">
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="actions">
        <DropDown>
          <div class="servings">
            <Button
              @click="portionCount = Math.max(portionCount - 1, 1)"
              :aria-label="$t('recipePage.ariaLabel.decreaseServings')"
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.SECONDARY"
            >
              <font-awesome-icon :icon="['fas', 'minus']" />
            </Button>
            <p>
              {{ portionCount }}
              <span>{{ $t('recipePage.servings', portionCount) }}</span>
            </p>
            <Button
              @click="portionCount++"
              :aria-label="$t('recipePage.ariaLabel.increaseServings')"
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.SECONDARY"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
            </Button>
          </div>
          <Button
            @click="addToGroceryList"
            :disabled="groceryListStore.isLoadingAction('setGroceryList')"
            :aria-busy="groceryListStore.isLoadingAction('setGroceryList')"
            :aria-label="$t('recipePage.addToGroceryList')"
            :type="ButtonType.SUBMIT"
            :variant="ColorVariant.SECONDARY"
          >
            <font-awesome-icon :icon="['fas', 'basket-shopping']" />
            <span class="desktop">{{ $t('recipePage.addToGroceryList') }}</span>
          </Button>
        </DropDown>
      </div>
    </div>
    <CheckBoxList :items="ingredients">
      <template #item="{ item, index }">
        <SelectField
          :ariaLabel="$t('general.recipe.ariaLabel.unit')"
          :placeholder="$t('general.recipe.placeholder.unit')"
          :items="toSelectOptions(getPossibleUnits(item.slot!))"
          labelPrefix="general.recipe.units."
          :selected="item.slot"
          @update:selected="(unit) => changeIngredientUnit(index, unit!)"
        />
        <p>{{ item.name }}</p>
      </template>
    </CheckBoxList>
  </section>
</template>

<script setup lang="ts">
import SelectField from '@/components/form/SelectField.vue';
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import { useRecipePortions } from '@/composables/useRecipePortions';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed } from 'vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import { useToastStore } from '@/stores/useToastStore';
import { toSelectOptions } from '@/utils/global/selectOptions';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';
import DropDown from '@/components/general/DropDown.vue';

const groceryListStore = useGroceryListStore();
const toastStore = useToastStore();

const { portionCount, portionedIngredients, changeIngredientUnit } = useRecipePortions();

const ingredients = computed(() => toIngredientCheckBoxes(portionedIngredients.value));

/**
 * Add the ingredients for the chosen servings to the grocery list, and confirm it with a toast
 */
async function addToGroceryList(): Promise<void> {
  if (await groceryListStore.setGroceryList(portionedIngredients.value)) {
    toastStore.showToast({ type: 'success', title: 'recipePage.addedToGroceryList' });
  }
}
</script>
