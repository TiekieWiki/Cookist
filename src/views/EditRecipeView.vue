<template>
  <main class="editRecipe">
    <Transition name="fade" mode="out-in">
      <div v-if="recipeStore.isLoading" key="loading" class="loader">
        <div class="loader-spinner"></div>
      </div>
      <article v-else-if="$route.params.recipeId && !recipeStore.recipe.name" key="notFound">
        <EmptyState
          icon="martini-glass-empty"
          title="general.recipe.notFound"
          subtitle="general.recipe.notFoundSubtitle"
          button-text="general.pageTitles.recipes"
          button-icon="arrow-left"
          button-route="/recipes"
        />
      </article>
      <article v-else key="form">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.LARGE"
          to="/recipes"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          {{ $t('editRecipePage.backToRecipes') }}</Button
        >
        <div>
          <h2>
            {{ $route.params.recipeId ? $t('general.pageTitles.editRecipe') : $t('general.pageTitles.createRecipe') }}
          </h2>
          <p>{{ $t('editRecipePage.subtitle') }}</p>
        </div>

        <form>
          <EditInfo v-model:recipe="recipe" />
          <EditIngredients v-model:ingredients="recipe.ingredients" />
          <EditInstructions v-model:instructions="recipe.instructions" />
          <EditExtras v-model:notes="recipe.notes" v-model:image="image" />
          <ErrorMessage v-model:message="recipeStore.errorMessage" />
          <div class="compact">
            <Button
              @click="saveRecipe()"
              id="save"
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.PRIMARY"
              :size="Size.LARGE"
            >
              {{ $t('editRecipePage.save') }}
            </Button>
            <Button
              @click="$router.go(-1)"
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.TERTIARY"
              :size="Size.LARGE"
            >
              {{ $t('general.actions.cancel') }}
            </Button>
          </div>
        </form>
      </article>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { useEditRecipe } from '@/composables/useEditRecipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import EditInfo from '@/components/pages/edit recipe/EditInfo.vue';
import EditIngredients from '@/components/pages/edit recipe/EditIngredients.vue';
import EditInstructions from '@/components/pages/edit recipe/EditInstructions.vue';
import EditExtras from '@/components/pages/edit recipe/EditExtras.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import EmptyState from '@/components/general/EmptyState.vue';

const recipeStore = useRecipeStore();
const { recipe, image, saveRecipe } = useEditRecipe();
</script>
