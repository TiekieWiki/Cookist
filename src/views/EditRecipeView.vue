<template>
  <main class="editRecipe">
    <article v-if="$route.params.recipeId && !recipeStore.recipe.name">
      <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
    </article>
    <article v-else>
      <router-link to="/recipes" tabindex="-1">
        <Button :type="ButtonType.BUTTON" :variant="ColorVariant.TERTIARY" :size="Size.LARGE">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          {{ $t('editRecipePage.backToRecipes') }}</Button
        ></router-link
      >
      <div>
        <h2>
          {{ $route.params.recipeId ? $t('editRecipePage.title') : $t('createRecipePage.title') }}
        </h2>
        <p>{{ $t('editRecipePage.subtitle') }}</p>
      </div>

      <form>
        <EditInfo v-model:recipe="recipe" />
        <EditIngredients v-model:ingredients="recipe.ingredients" />
        <EditInstructions v-model:instructions="recipe.instructions" />
        <EditExtras v-model:notes="recipe.notes" v-bind:image="image" />
        <ErrorMessage v-if="recipeStore.errorMessage" v-model:message="recipeStore.errorMessage" />
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
            {{ $t('editRecipePage.cancel') }}
          </Button>
        </div>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useEditRecipe } from '@/composables/useEditRecipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import EditInfo from '@/components/edit recipe/EditInfo.vue';
import EditIngredients from '@/components/edit recipe/EditIngredients.vue';
import EditInstructions from '@/components/edit recipe/EditInstructions.vue';
import EditExtras from '@/components/edit recipe/EditExtras.vue';

const recipeStore = useRecipeStore();
const { recipe, image, saveRecipe } = useEditRecipe();
</script>
