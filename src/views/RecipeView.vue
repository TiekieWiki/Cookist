<template>
  <main class="recipe">
    <Transition name="fade" mode="out-in">
      <LoadingSpinner v-if="recipeStore.isLoadingAction('getRecipe')" key="loading" />
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
        <ErrorMessage v-model:message="recipeStore.errorMessage" />
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
  </main>
  <ConfirmPopUp
    v-model:open-pop-up="deleteRecipeOpen"
    title="recipePage.deleteRecipe"
    section="recipePage.confirmDelete"
    cancel="general.actions.cancel"
    confirm="general.actions.delete"
    :loading="recipeStore.isLoadingAction('deleteRecipe')"
    @confirm="deleteRecipe()"
  />
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { ref } from 'vue';
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
import ErrorMessage from '@/components/form/ErrorMessage.vue';

const recipeStore = useRecipeStore();
const route = useRoute();
const router = useRouter();

recipeStore.getRecipe(route.params.recipeId as string);

const deleteRecipeOpen = ref<boolean>(false);

/**
 * Delete recipe and go back to the recipes when it succeeded
 */
async function deleteRecipe(): Promise<void> {
  await recipeStore.deleteRecipe(recipeStore.recipe.id);

  deleteRecipeOpen.value = false;

  if (!recipeStore.errorMessage) {
    await router.push({ path: '/recipes' });
  }
}
</script>
