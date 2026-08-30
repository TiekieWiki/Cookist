<template>
  <section class="ingredients card">
    <div class="title">
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="actions">
        <div class="servings">
          <Button
            @click="portionCount = Math.max(portionCount - 1, 1)"
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
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.SECONDARY"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </Button>
        </div>
        <Button
          @click="groceryListStore.setGroceryList(portionedIngredients)"
          :type="ButtonType.SUBMIT"
          :variant="ColorVariant.SECONDARY"
        >
          <font-awesome-icon :icon="['fas', 'basket-shopping']" />
          <span class="desktop">{{ $t('recipePage.addToGroceryList') }}</span>
        </Button>
      </div>
    </div>
    <CheckBoxList :items="ingredients">
      <template #item="{ item }">
        <SelectField
          :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
          :placeholder="$t('editRecipePage.placeholder.unit')"
          :items="
            Object.values(getPossibleUnits(item.slot!)).map((unit) => ({
              value: (unit as string).toLowerCase(),
              label: (unit as string).toLowerCase()
            }))
          "
          labelPrefix="editRecipePage.units."
          v-model:selected="item.slot"
          @change="changeIngredientUnit()"
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
import Button from '../form/Button.vue';
import { ButtonType, ColAmount, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';

const groceryListStore = useGroceryListStore();

const { portionCount, portionedIngredients, changeIngredientUnit } = useRecipePortions();

const ingredients = computed(() => {
  return portionedIngredients.value.map((ingredient) => {
    return {
      name: ingredient.name,
      label: ingredient.amount.toString(),
      slot: ingredient.unit
    } as CheckBoxProps;
  });
});
</script>
