<template>
  <section v-if="groceryListStore.groceryList.length <= 0">
    <h2>{{ $t('groceryListPage.title') }}</h2>
    <h3>{{ $t('groceryListPage.noItems') }}</h3>
  </section>
  <section v-else>
    <div>
      <h2>{{ $t('groceryListPage.title') }}</h2>
      <div>
        <Button :type="ButtonType.BUTTON" :iconOnly="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </div>
    <TransitionGroup name="fade" tag="div">
      <CheckBoxList :items="ingredients">
        <template #item="{ item, index }">
          <SelectField
            :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
            :placeholder="$t('editRecipePage.placeholder.unit')"
            :items="
              Object.values(getPossibleUnits(item.slot!)).map((unit) => ({
                value: unit.toLowerCase(),
                label: unit.toLowerCase()
              }))
            "
            labelPrefix="editRecipePage.units."
            v-model:selected="item.slot"
            @change="changeIngredientUnit(item, index)"
          />
          <p>{{ item.name }}</p>
          <Button
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.WARNING"
            @click="
              groceryListStore.deleteGroceryListIngredient(groceryListStore.groceryList[index].id!)
            "
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </Button>
        </template>
      </CheckBoxList>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import { getPossibleUnits, updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });

const groceryListStore = useGroceryListStore();

const ingredients = computed(() => {
  return groceryListStore.groceryList.map((ingredient) => {
    return {
      name: ingredient.name,
      label: ingredient.amount.toString(),
      slot: ingredient.unit
    } as CheckBoxProps;
  });
});

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
