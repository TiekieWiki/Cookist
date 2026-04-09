<template>
  <article>
    <section class="title">
      <h3>{{ $t('recipePage.ingredients') }}</h3>
      <div class="portionCalculator">
        <font-awesome-icon
          @click="portionCount = Math.max(portionCount - 1, 1)"
          class="edit"
          :icon="['fas', 'minus']"
        />
        <p>{{ portionCount }} {{ $t('recipePage.portions', portionCount) }}</p>
        <font-awesome-icon @click="portionCount++" class="edit" :icon="['fas', 'plus']" />
      </div>
    </section>
    <div class="label-group">
      <label v-for="ingredient in recipe.ingredients" :key="ingredient.name" class="ingredient">
        <input :name="ingredient.name" type="checkbox" />
        {{ ingredient.amount }}
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
    <button @click="addToGroceryList(recipe.ingredients)" class="icon" type="button">
      <font-awesome-icon :icon="['fas', 'plus']" />
      {{ $t('recipePage.addToGroceryList') }}
    </button>
  </article>
</template>

<script setup lang="ts">
import SelectField from '@/components/form/SelectField.vue';
import { getPossibleUnits, updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { addToGroceryList } from '@/utils/grocery list/editGroceryList';
import { useRecipe } from '@/composables/useRecipe';

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
