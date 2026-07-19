<template>
  <main v-if="$route.params.recipeId && !recipeStore.recipe.name">
    <article class="card">
      <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
    </article>
  </main>
  <main v-else class="editRecipe">
    <article>
      <NewRecipe
        v-model:recipe="recipe"
        v-model:image="image"
        @save="saveRecipe(recipe, image)"
        v-model:error-message="recipeStore.errorMessage"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/edit recipe/NewRecipe.vue';
import { useEditRecipe } from '@/composables/useEditRecipe';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { emptyRecipe, Recipe } from '@/utils/types/recipe';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const recipeStore = useRecipeStore();
const { saveRecipe } = useEditRecipe();
const route = useRoute();
const recipe = ref<Recipe>(emptyRecipe());
const image = ref<File | null>(null);

onMounted(() => {
  if (route.params.recipeId) {
    recipeStore.getRecipe(route.params.recipeId as string);
    recipe.value = recipeStore.recipe;
  }
});
</script>
