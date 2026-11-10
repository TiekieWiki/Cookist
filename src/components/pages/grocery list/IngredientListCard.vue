<template>
  <section class="card">
    <div class="title">
      <h3>{{ title }}</h3>
      <Button
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.WARNING"
        :aria-label="$t('groceryListPage.ariaLabel.deleteGroup', { name: title })"
        :disabled="isDeletingGroup"
        :aria-busy="isDeletingGroup"
        @click="groceryListStore.deleteGroceryListIngredient(groupIds)"
      >
        <font-awesome-icon :icon="['fas', 'trash-can']" />
        <span class="desktop">{{ $t('groceryListPage.clearAll') }}</span>
      </Button>
    </div>
    <CheckBoxList :items="checkBoxes">
      <template #item="{ item }">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :aria-label="$t('groceryListPage.ariaLabel.deleteIngredient', { name: item.name })"
          :disabled="isDeletingGroup || isDeleting(item.id)"
          :aria-busy="isDeleting(item.id)"
          @click="groceryListStore.deleteGroceryListIngredient(idsOf(item.id))"
        >
          <font-awesome-icon :icon="['fas', 'trash-can']" />
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
import { type GroceryListEntry } from '@/utils/types/groceryList';

const props = defineProps<{ title: string; ingredients: GroceryListEntry[] }>();

const groceryListStore = useGroceryListStore();

const checkBoxes = computed(() => toIngredientCheckBoxes(props.ingredients));

const groupIds = computed(() => props.ingredients.flatMap((ingredient) => ingredient.ids));

const isDeletingGroup = computed(() =>
  groceryListStore.isLoadingAction('deleteGroceryListIngredient', groupIds.value.join(','))
);

/**
 * Get the ids of the rows an ingredient consists of, which are several for a combined ingredient
 * @param id Id of the ingredient
 * @returns The ids of the rows
 */
function idsOf(id: string | undefined): string[] {
  return props.ingredients.find((ingredient) => ingredient.id === id)?.ids ?? [];
}

/**
 * Check whether an ingredient is being deleted
 * @param id Id of the ingredient
 * @returns Whether the ingredient is busy
 */
function isDeleting(id: string | undefined): boolean {
  const ids = idsOf(id);

  return (
    ids.length > 0 && groceryListStore.isLoadingAction('deleteGroceryListIngredient', ids.join(','))
  );
}
</script>
