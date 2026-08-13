<template>
  <main v-if="recipeStore.recipe.name" class="recipe">
    <article>
      <div>
        <RecipeHeaderCard v-model:delete-open="deleteRecipeOpen" />
        <IngredientsCard />
      </div>
      <div>
        <InstructionsCard />
        <TimerCard />
      </div>
    </article>
  </main>
  <main v-else>
    <article>
      <h2>{{ $t('recipePage.recipeNotFound') }}</h2>
    </article>
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
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import TimerCard from '@/components/recipe/TimerCard.vue';
import RecipeHeaderCard from '@/components/recipe/RecipeHeaderCard.vue';
import IngredientsCard from '@/components/recipe/IngredientsCard.vue';
import InstructionsCard from '@/components/recipe/InstructionsCard.vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useRoute } from 'vue-router';

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
