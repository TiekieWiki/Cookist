<template>
  <section class="title">
    <div>
      <h2>{{ $t('general.pageTitles.groceryList') }}</h2>
      <p>
        {{
          groceryListStore.groceryList.length <= 0
            ? $t('groceryListPage.noItems')
            : `${groceryListStore.groceryList.length} ${$t('groceryListPage.itemsToBuy', groceryListStore.groceryList.length)}`
        }}
      </p>
    </div>
    <div class="actions">
      <Button
        @click="combineIngredients = !combineIngredients"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.SECONDARY"
      >
        <font-awesome-icon
          :icon="[
            'fas',
            combineIngredients
              ? 'up-right-and-down-left-from-center'
              : 'down-left-and-up-right-to-center'
          ]"
        />
        <span class="desktop">{{
          $t(
            combineIngredients
              ? 'groceryListPage.groupIngredients'
              : 'groceryListPage.combineIngredients'
          )
        }}</span>
      </Button>
      <Button @click="deleteOpen = true" :type="ButtonType.BUTTON" :variant="ColorVariant.WARNING">
        <font-awesome-icon :icon="['fas', 'trash-can']" />
        <span class="desktop">{{ $t('groceryListPage.clearAll') }}</span>
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';

const groceryListStore = useGroceryListStore();

const combineIngredients = defineModel<boolean>('combineIngredients', { required: true });
const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
