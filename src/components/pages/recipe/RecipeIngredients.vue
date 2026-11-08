<template>
  <section class="ingredients card">
    <div class="title">
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="actions">
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
            <span class="desktop">{{ $t('recipePage.servings', portionCount) }}</span>
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
      </div>
    </div>
    <CheckBoxList :items="ingredients" />
  </section>
</template>

<script setup lang="ts">
import { useRecipePortions } from '@/composables/useRecipePortions';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed } from 'vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import { useToastStore } from '@/stores/useToastStore';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { usePantryStore } from '@/stores/usePantryStore';

const groceryListStore = useGroceryListStore();
const recipeStore = useRecipeStore();
const pantryStore = usePantryStore();
const toastStore = useToastStore();

const { portionCount, portionedIngredients } = useRecipePortions();

const ingredients = computed(() => toIngredientCheckBoxes(portionedIngredients.value));

/**
 * Add the ingredients for the chosen servings to the grocery list, and confirm it with a toast
 */
async function addToGroceryList(): Promise<void> {
  if (await groceryListStore.setGroceryList(portionedIngredients.value, recipeStore.recipe.id)) {
    await pantryStore.setPantry(recipeStore.recipe.id);
    toastStore.showToast({ type: 'success', title: 'recipePage.addedToGroceryList' });
  }
}
</script>
