<template>
  <main class="pantry">
    <article>
      <PantryTitle v-model:delete-open="deletePantryOpen" />
    </article>
  </main>
  <ConfirmPopUp
    v-model:open-pop-up="deletePantryOpen"
    title="pantryPage.emptyPantry"
    section="pantryPage.confirmEmpty"
    cancel="general.actions.cancel"
    confirm="pantryPage.empty"
    :loading="pantryStore.isLoadingAction('deletePantry')"
    :error="pantryStore.errorFor('deletePantry')"
    @confirm="deletePantry()"
  />
</template>

<script setup lang="ts">
import { usePantryStore } from '@/stores/usePantryStore';
import { ref, watch } from 'vue';
import PantryTitle from '@/components/pages/pantry/PantryTitle.vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';

const pantryStore = usePantryStore();

const deletePantryOpen = ref<boolean>(false);

/**
 * Delete pantry. When it fails, the pop-up stays open and shows why.
 */
async function deletePantry(): Promise<void> {
  if (await pantryStore.deletePantry()) {
    deletePantryOpen.value = false;
  }
}

watch(deletePantryOpen, (open) => {
  if (open) pantryStore.clearError('deletePantry');
});
</script>
