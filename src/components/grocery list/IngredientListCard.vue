<template>
  <article v-if="groceryList?.ingredients.length <= 0">
    <h3>{{ $t('groceryListPage.noItems') }}</h3>
  </article>
  <article v-else>
    <section>
      <h3>{{ $t('groceryListPage.ingredients') }}</h3>
      <div>
        <Button :type="ButtonType.BUTTON" :iconOnly="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="emptyGroceryListOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </section>
    <TransitionGroup name="fade" tag="div">
      <CheckBoxList :items="ingredients">
        <template #item="{ item, index }">
          <SelectField
            :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
            :placeholder="$t('editRecipePage.placeholder.unit')"
            :items="
              Object.values(getPossibleUnits(item.slot)).map((unit) => ({
                value: unit.toLowerCase(),
                label: unit.toLowerCase()
              }))
            "
            labelPrefix="editRecipePage.units."
            v-model:selected="item.slot"
            @change="changeIngredientUnit()"
          />
          {{ item.name }}
          <Button :type="ButtonType.BUTTON" @click="deleteIngredient(index)">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </Button>
        </template>
      </CheckBoxList>
    </TransitionGroup>
  </article>
</template>

<script setup lang="ts">
import { useGroceryList } from '@/composables/useGroceryList';
import { getPossibleUnits } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { CheckBoxProps } from '@/utils/types/form';

const { groceryList, emptyGroceryListOpen, deleteIngredient, changeIngredientUnit } =
  useGroceryList();

const ingredients = computed(() => {
  return groceryList.value.ingredients.map((ingredient) => {
    return {
      name: ingredient.name,
      label: capitalizeFirstLetter(ingredient.name),
      slot: ingredient.unit
    } as CheckBoxProps;
  });
});
</script>
