<template>
  <main class="recipe">
    <Transition name="fade" mode="out-in">
      <LoadingSpinner v-if="recipeStore.isLoadingAction('getRecipe')" key="loading" />
      <article v-else-if="loadError" key="error">
        <ErrorState :error="loadError" @retry="loadRecipe" />
      </article>
      <article v-else-if="recipeStore.recipe.name" key="recipe">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.LARGE"
          to="/recipes"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          {{ $t('recipePage.allRecipes') }}</Button
        >
        <img :src="recipeStore.recipeImage" :alt="recipeStore.recipe.name" />
        <div class="content">
          <div class="main">
            <RecipeInfo v-model:delete-open="deleteRecipeOpen" />
            <RecipeIngredients />
            <RecipeInstructions />
          </div>
          <div class="sidebar">
            <RecipeLastEaten />
            <TimerCard />
          </div>
        </div>
      </article>
      <article v-else key="notFound">
        <EmptyState
          icon="martini-glass-empty"
          title="general.recipe.notFound"
          subtitle="general.recipe.notFoundSubtitle"
          button-text="general.pageTitles.recipes"
          button-icon="arrow-left"
          button-route="/recipes"
        />
      </article>
    </Transition>
    <ConfirmPopUp
      v-model:open-pop-up="deleteRecipeOpen"
      title="recipePage.deleteRecipe"
      section="recipePage.confirmDelete"
      cancel="general.actions.cancel"
      confirm="general.actions.delete"
      :loading="recipeStore.isLoadingAction('deleteRecipe')"
      :error="recipeStore.errorFor('deleteRecipe')"
      @confirm="deleteRecipe()"
    />
  </main>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { computed, ref, watch } from 'vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';
import TimerCard from '@/components/pages/recipe/TimerCard.vue';
import RecipeInfo from '@/components/pages/recipe/RecipeInfo.vue';
import RecipeIngredients from '@/components/pages/recipe/RecipeIngredients.vue';
import RecipeInstructions from '@/components/pages/recipe/RecipeInstructions.vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import RecipeLastEaten from '@/components/pages/recipe/RecipeLastEaten.vue';
import EmptyState from '@/components/general/EmptyState.vue';
import ErrorState from '@/components/general/ErrorState.vue';

const recipeStore = useRecipeStore();
const route = useRoute();
const router = useRouter();

const deleteRecipeOpen = ref<boolean>(false);
const loadError = computed(() => recipeStore.errorFor('getRecipe'));

/**
 * Load the recipe of the current route
 */
function loadRecipe(): void {
  recipeStore.getRecipe(route.params.recipeId as string);
}

/**
 * Delete recipe and go back to the recipes when it succeeded. When it fails, the pop-up stays open
 * and shows why.
 */
async function deleteRecipe(): Promise<void> {
  if (!(await recipeStore.deleteRecipe(recipeStore.recipe.id))) return;

  deleteRecipeOpen.value = false;
  await router.push({ path: '/recipes' });
}

loadRecipe();

watch(deleteRecipeOpen, (open) => {
  if (open) recipeStore.clearError('deleteRecipe');
});
</script>
