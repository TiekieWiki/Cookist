<template>
  <article>
    <section>
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div>
        <Button
          @click="portionCount = Math.max(portionCount - 1, 1)"
          :type="ButtonType.BUTTON"
          :iconOnly="true"
        >
          <font-awesome-icon :icon="['fas', 'minus']" />
        </Button>
        <p>{{ portionCount }} {{ $t('recipePage.portions', portionCount) }}</p>
        <Button @click="portionCount++" :type="ButtonType.BUTTON" :iconOnly="true">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </Button>
      </div>
    </section>
    <CheckBoxList :items="ingredients">
      <template #item="{ item, index }">
        <SelectField
          :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
          :placeholder="$t('editRecipePage.placeholder.unit')"
          :items="
            Object.values(getPossibleUnits(item.slot)).map((unit) => ({
              value: (unit as string).toLowerCase(),
              label: (unit as string).toLowerCase()
            }))
          "
          labelPrefix="editRecipePage.units."
          v-model:selected="item.slot"
          @change="changeIngredientUnit()"
        />
        {{ item.name }}
      </template>
    </CheckBoxList>
    <Button @click="addToGroceryList(recipe.ingredients)" :type="ButtonType.SUBMIT">
      <font-awesome-icon :icon="['fas', 'plus']" />
      {{ $t('recipePage.addToGroceryList') }}
    </Button>
  </article>
</template>

<script setup lang="ts">
import SelectField from '@/components/form/SelectField.vue';
import { getPossibleUnits, updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { addToGroceryList } from '@/utils/grocery list/editGroceryList';
import { useRecipe } from '@/composables/useRecipe';
import Button from '../form/Button.vue';
import { ButtonType } from '@/utils/types/enums';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { CheckBoxProps } from '@/utils/types/form';

const { recipe, initialIngredients, portionCount } = useRecipe();

const ingredients = computed(() => {
  return recipe.value.ingredients.map((ingredient) => {
    return {
      name: ingredient.name,
      label: capitalizeFirstLetter(ingredient.name),
      slot: ingredient.unit
    } as CheckBoxProps;
  });
});

/**
 * Update the ingredient unit
 */
function changeIngredientUnit(): void {
  recipe.value.ingredients = updateIngredientUnit(
    initialIngredients,
    recipe.value.ingredients,
    recipe.value.portions,
    portionCount.value
  );
}
</script>
