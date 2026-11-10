<template>
  <main class="pantry">
    <article>
      <PantryTitle v-model:delete-open="deletePantryOpen" />
      <Transition name="fade" mode="out-in">
        <LoadingSpinner
          v-if="pantryStore.isLoadingAction('getPantry') && !pantryStore.pantry.length"
          key="loading"
        />
        <ErrorState
          v-else-if="pantryStore.errorFor('getPantry')"
          key="error"
          :error="pantryStore.errorFor('getPantry')!"
          @retry="pantryStore.getPantry()"
        />
        <div v-else key="list" class="groups">
          <Transition name="fade" mode="out-in">
            <EmptyState
              v-if="pantryStore.pantry.length <= 0"
              key="empty"
              icon="kitchen-set"
              title="pantryPage.emptyPantryTitle"
              subtitle="pantryPage.emptyPantrySubtitle"
              buttonText="pantryPage.browseRecipes"
              buttonRoute="/recipes"
            />
            <section v-else key="list" class="recipesList">
              <RecipeGrid :recipes="pantryStore.recipes" :images="pantryStore.recipeImages" />
            </section>
          </Transition>
        </div>
      </Transition>
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
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import ErrorState from '@/components/general/ErrorState.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import RecipeGrid from '@/components/pages/recipes/RecipeGrid.vue';

const pantryStore = usePantryStore();

const deletePantryOpen = ref<boolean>(false);

pantryStore.getPantry();

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
