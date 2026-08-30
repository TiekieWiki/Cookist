<template>
  <section class="title">
    <div>
      <h2>{{ $t('groceryListPage.title') }}</h2>
      <p>
        {{
          groceryListStore.groceryList.length <= 0
            ? $t('groceryListPage.noItems')
            : `${groceryListStore.groceryList.length} ${$t('groceryListPage.itemsToBuy', groceryListStore.groceryList.length)}`
        }}
      </p>
    </div>
    <div class="actions">
      <Button :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY">
        <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        {{ $t('groceryListPage.clearAll') }}
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { useGroceryListStore } from '@/stores/useGroceryListStore.js';

const groceryListStore = useGroceryListStore();

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
