<template>
  <main v-if="$route.params.recipeId && recipe.name == ''">
    <article class="card">
      <h2>{{ $t('editRecipePage.recipeNotFound') }}</h2>
    </article>
  </main>
  <main v-else class="editRecipe">
    <article>
      <NewRecipe
        v-model:recipe="recipe"
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
import { useRecipeStore } from '@/stores/useRecipeStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const recipeStore = useRecipeStore();
const { recipe } = storeToRefs(recipeStore);
const { image, errorMessage, save } = useEditRecipe();
const route = useRoute();

onMounted(() => {
  recipeStore.getRecipe(route.params.recipeId as string);
});
</script>
