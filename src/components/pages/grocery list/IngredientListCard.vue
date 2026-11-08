<template>
  <section class="card">
    <h3>{{ title }}</h3>
    <CheckBoxList :items="checkBoxes">
      <template #item="{ item }">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :aria-label="$t('groceryListPage.ariaLabel.deleteIngredient', { name: item.name })"
          :disabled="isDeleting(item.id)"
          :aria-busy="isDeleting(item.id)"
          @click="groceryListStore.deleteGroceryListIngredient(item.id!)"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
        </Button>
      </template>
    </CheckBoxList>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed } from 'vue';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';
import { toIngredientCheckBoxes } from '@/utils/recipe/ingredientCheckBoxes';
import { type GroceryListItem } from '@/utils/types/groceryList';

const props = defineProps<{ title: string; ingredients: GroceryListItem[] }>();

const groceryListStore = useGroceryListStore();

const checkBoxes = computed(() => toIngredientCheckBoxes(props.ingredients));

/**
 * Check whether an ingredient is being deleted
 * @param id Id of the ingredient
 * @returns Whether the ingredient is busy
 */
function isDeleting(id: string | undefined): boolean {
  return !!id && groceryListStore.isLoadingAction('deleteGroceryListIngredient', id);
}
</script>
