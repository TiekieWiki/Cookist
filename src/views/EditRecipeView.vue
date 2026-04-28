<template>
  <main v-if="$route.params.cookGroupRecipeId && !recipe.name">
    <article class="card">
      <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
    </article>
  </main>
  <main v-else class="editRecipe">
    <article>
      <NewRecipe
        v-model:recipe="recipe"
        v-model:cook-groups="cookGroups"
        v-model:cook-group-recipe="cookGroupRecipe"
        v-model:image="image"
        v-model:save="save"
        v-model:error-message="errorMessage"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/edit recipe/NewRecipe.vue';
import { useEditRecipe } from '@/composables/useEditRecipe';

const { recipe, cookGroups, cookGroupRecipe, image, errorMessage, save } = useEditRecipe();
</script>
