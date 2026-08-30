<template>
  <div class="card">
    <div v-if="groceryListStore.groceryList.length <= 0" class="empty">
      <Pill :variant="ColorVariant.TERTIARY" :size="Size.XLARGE"
        ><font-awesome-icon :icon="['fas', 'basket-shopping']"
      /></Pill>
      <div>
        <h3>{{ $t('groceryListPage.emptyBasket') }}</h3>
        <p>{{ $t('groceryListPage.emptyBasketSubtitle') }}</p>
      </div>
      <router-link to="/recipes" tabindex="-1">
        <Button :type="ButtonType.BUTTON" :variant="ColorVariant.PRIMARY" :size="Size.LARGE">
          {{ $t('groceryListPage.browseRecipes') }}</Button
        ></router-link
      >
    </div>
    <TransitionGroup v-else name="fade" tag="div">
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
            :variant="ColorVariant.TERTIARY"
            @click="
              groceryListStore.deleteGroceryListIngredient(groceryListStore.groceryList[index].id!)
            "
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </Button>
        </template>
      </CheckBoxList>
    </TransitionGroup>
    <div class="addIngredient">
      <InputField
        name="newIngredientAmount"
        :placeholder="$t('editRecipePage.placeholder.amount')"
        :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
        :step="0.01"
        type="number"
        v-model:input="ingredient.amount"
      />
      <SelectField
        :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
        :placeholder="$t('editRecipePage.placeholder.unit')"
        :items="
          Object.values(RecipeUnits).map((unit) => ({
            value: unit.toLowerCase(),
            label: unit.toLowerCase()
          }))
        "
        labelPrefix="editRecipePage.units."
        v-model:selected="ingredient.unit"
      />
      <InputField
        name="newIngredientName"
        :placeholder="$t('editRecipePage.placeholder.ingredient')"
        :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
        type="text"
        v-model:input="ingredient.name"
      />

      <Button
        @click="groceryListStore.setGroceryList(ingredient)"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.PRIMARY"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        <p class="desktop">{{ $t('groceryListPage.addIngredient') }}</p>
      </Button>
    </div>
    <ErrorMessage v-model:message="groceryListStore.errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { getPossibleUnits, updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import SelectField from '@/components/form/SelectField.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import Pill from '../general/Pill.vue';
import InputField from '@/components/form/InputField.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { emptyIngredient, Ingredient, RecipeUnits } from '@/utils/types/recipe';
import { ref } from 'vue';

const ingredient = ref<Ingredient>(emptyIngredient());

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
