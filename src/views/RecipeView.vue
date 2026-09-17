<template>
  <main class="recipe">
    <Transition name="fade" mode="out-in">
      <article v-if="recipeStore.recipe.name" key="recipe">
        <router-link to="/recipes" tabindex="-1">
          <Button :type="ButtonType.BUTTON" :variant="ColorVariant.TERTIARY" :size="Size.LARGE">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
            {{ $t('recipePage.allRecipes') }}</Button
          ></router-link
        >
        <img :src="recipeStore.recipeImage" />
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
          title="recipePage.recipeNotFound"
          subtitle="recipePage.recipeNotFoundSubtitle"
          button-text="recipesPage.title"
          button-icon="arrow-left"
          button-route="/recipes"
        />
      </article>
    </Transition>
  </main>
  <ConfirmPopUp
    v-model:open-pop-up="deleteRecipeOpen"
    :title="$t('recipePage.deleteRecipe')"
    :section="$t('recipePage.confirmDelete')"
    :cancel="$t('recipePage.cancel')"
    :confirm="$t('recipePage.delete')"
    @confirm="deleteRecipe()"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';
import TimerCard from '@/components/recipe/TimerCard.vue';
import RecipeInfo from '@/components/recipe/RecipeInfo.vue';
import RecipeIngredients from '@/components/recipe/RecipeIngredients.vue';
import RecipeInstructions from '@/components/recipe/RecipeInstructions.vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useRoute } from 'vue-router';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import RecipeLastEaten from '@/components/recipe/RecipeLastEaten.vue';
import EmptyState from '@/components/general/EmptyState.vue';

const recipeStore = useRecipeStore();
const route = useRoute();

onMounted(() => {
  recipeStore.getRecipe(route.params.recipeId as string);
});

const deleteRecipeOpen = ref<boolean>(false);

/**
 * Delete recipe
 */
function deleteRecipe(): void {
  deleteRecipeOpen.value = false;
  recipeStore.recipe ? recipeStore.deleteRecipe(recipeStore.recipe.id) : '';
}
</script>
