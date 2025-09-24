<template>
  <main v-if="$route.params.cookGroupRecipeId && !recipe.name" class="editRecipe">
    <article>
      <section class="header">
        <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
      </section>
    </article>
  </main>
  <main v-else class="editRecipe">
    <article>
      <h2>{{ $t('editRecipePage.title') }}</h2>
      <form>
        <new-recipe
          v-model:recipe="recipe"
          v-model:cook-groups="cookGroups"
          v-model:cook-group-recipe="cookGroupRecipe"
          v-model:image="image"
          v-model:error-message="errorMessage"
        />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('editRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/recipe/NewRecipe.vue';
import { useEditRecipe } from '@/composables/useEditRecipe';

const { recipe, cookGroups, cookGroupRecipe, image, errorMessage, saveRecipe } = useEditRecipe();
</script>
