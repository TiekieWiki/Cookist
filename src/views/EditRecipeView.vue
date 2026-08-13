<template>
  <main v-if="$route.params.recipeId && !recipeStore.recipe.name">
    <article>
      <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
    </article>
  </main>
  <main v-else class="editRecipe">
    <article>
      <NewRecipe
        v-model:recipe="recipe"
        v-model:image="image"
        @save="saveRecipe()"
        v-model:error-message="recipeStore.errorMessage"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/edit recipe/NewRecipe.vue';
import { useEditRecipe } from '@/composables/useEditRecipe';
import { useRecipeStore } from '@/stores/useRecipeStore';

const recipeStore = useRecipeStore();
const { recipe, image, saveRecipe } = useEditRecipe();
</script>
