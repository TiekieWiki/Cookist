<template>
  <section class="title">
    <div>
      <h2>{{ $t('general.pageTitles.pantry') }}</h2>
      <p>
        {{
          pantryStore.pantry.length <= 0
            ? $t('pantryPage.noRecipes')
            : `${pantryStore.pantry.length} ${$t('pantryPage.recipesToCook', pantryStore.pantry.length)}`
        }}
      </p>
    </div>
    <div class="actions">
      <Button @click="deleteOpen = true" :type="ButtonType.BUTTON" :variant="ColorVariant.WARNING">
        <font-awesome-icon :icon="['fas', 'trash-can']" />
        <span class="desktop">{{ $t('pantryPage.clearAll') }}</span>
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { usePantryStore } from '@/stores/usePantryStore';

const pantryStore = usePantryStore();

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
