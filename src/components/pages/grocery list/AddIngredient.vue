<template>
  <div class="addIngredient">
    <IngredientInputRow name="new-ingredient" v-model:ingredient="ingredient" />
    <Button
      @click="addIngredient()"
      :aria-label="$t('groceryListPage.addIngredient')"
      :disabled="groceryListStore.isLoadingAction('setGroceryList')"
      :aria-busy="groceryListStore.isLoadingAction('setGroceryList')"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.PRIMARY"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
      <span class="desktop">{{ $t('groceryListPage.addIngredient') }}</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { emptyIngredient, type Ingredient } from '@/utils/types/recipe';
import { ref } from 'vue';
import Button from '@/components/form/Button.vue';
import IngredientInputRow from '@/components/general/IngredientInputRow.vue';

const ingredient = ref<Ingredient>(emptyIngredient());

const groceryListStore = useGroceryListStore();

const addIngredient = async (): Promise<void> => {
  if (await groceryListStore.setGroceryList(ingredient.value)) {
    ingredient.value = emptyIngredient();
  }
};
</script>
