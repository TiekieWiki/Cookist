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
              <RecipeGrid :recipes="pantryStore.recipes" :images="pantryStore.recipeImages">
                <template #actions="{ recipe }">
                  <Button
                    @click="setLastEaten(recipe.id)"
                    :disabled="isBusy(recipe.id)"
                    :aria-busy="recipeStore.isLoadingAction('setLastEaten', recipe.id)"
                    :aria-label="$t('pantryPage.ariaLabel.cookedToday', { name: recipe.name })"
                    :type="ButtonType.BUTTON"
                    :variant="ColorVariant.PRIMARY"
                  >
                    <span class="desktop">{{ $t('pantryPage.cookedToday') }}</span>
                  </Button>
                  <Button
                    @click="pantryStore.deletePantryRecipe(recipe.id)"
                    :disabled="isBusy(recipe.id)"
                    :aria-busy="pantryStore.isLoadingAction('deletePantryRecipe', recipe.id)"
                    :aria-label="$t('pantryPage.ariaLabel.removeRecipe', { name: recipe.name })"
                    :type="ButtonType.BUTTON"
                    :variant="ColorVariant.WARNING"
                  >
                    <font-awesome-icon :icon="['fas', 'trash-can']" />
                  </Button>
                </template>
              </RecipeGrid>
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
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { toLocalISODate } from '@/utils/global/date';

const pantryStore = usePantryStore();
const recipeStore = useRecipeStore();

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

/**
 * Check whether a recipe card is busy, so its buttons cannot be pressed twice
 * @param recipeId Id of the recipe of the card
 * @returns Whether the recipe is being marked as cooked or removed
 */
function isBusy(recipeId: string): boolean {
  return (
    recipeStore.isLoadingAction('setLastEaten', recipeId) ||
    pantryStore.isLoadingAction('deletePantryRecipe', recipeId)
  );
}

/**
 * Mark a recipe as cooked today and take one of it out of the pantry. When saving the date fails,
 * the recipe stays in the pantry.
 * @param recipeId Id of the recipe that was cooked
 */
async function setLastEaten(recipeId: string): Promise<void> {
  const today = toLocalISODate(new Date());

  if (!(await recipeStore.setLastEaten(today, recipeId))) return;

  pantryStore.updateLastEaten(recipeId, today);
  await pantryStore.deletePantryRecipe(recipeId);
}
</script>
