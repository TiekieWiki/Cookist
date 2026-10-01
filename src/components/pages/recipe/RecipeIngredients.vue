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
          @click="groceryListStore.setGroceryList(portionedIngredients)"
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
import { toSelectOptions } from '@/utils/global/selectOptions';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';

const groceryListStore = useGroceryListStore();

const { portionCount, portionedIngredients, changeIngredientUnit } = useRecipePortions();

const ingredients = computed(() => toIngredientCheckBoxes(portionedIngredients.value));
</script>
