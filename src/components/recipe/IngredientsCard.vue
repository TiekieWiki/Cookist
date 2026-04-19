<template>
  <article>
    <section class="title">
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="portionCalculator">
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
    <div class="checkbox-list">
      <label v-for="ingredient in recipe.ingredients" :key="ingredient.name" class="ingredient">
        <CheckBox :name="ingredient.name" :label="ingredient.amount" />
        <SelectField
          :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
          :placeholder="$t('editRecipePage.placeholder.unit')"
          :items="
            Object.values(getPossibleUnits(ingredient.unit)).map((unit) => ({
              value: (unit as string).toLowerCase(),
              label: (unit as string).toLowerCase()
            }))
          "
          labelPrefix="editRecipePage.units."
          v-model:selected="ingredient.unit"
          @change="changeIngredientUnit()"
        />
        {{ ingredient.name }}
      </label>
    </div>
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
import CheckBox from '../form/CheckBox.vue';

const { recipe, initialIngredients, portionCount } = useRecipe();

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
