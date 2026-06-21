<template>
  <main v-if="recipe" class="recipe">
    <article class="row">
      <div class="column left">
        <RecipeHeaderCard
          :recipe="recipe"
          :last-eaten="lastEaten"
          v-model:delete-open="deleteRecipeOpen"
        />
        <IngredientsCard :recipe="recipe" />
      </div>
      <div class="column right">
        <InstructionsCard :recipe="recipe" :last-eaten-today="lastEatenToday" />
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
    @confirm="recipe ? deleteRecipe(recipe.id) : ''"
  />
</template>

<script setup lang="ts">
import { useSetRecipeImage } from '@/composables/useManageImage';
import { onMounted, ref } from 'vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import TimerCard from '@/components/recipe/TimerCard.vue';
import { deleteRecipe } from '@/utils/recipe/deleteRecipe';
import RecipeHeaderCard from '@/components/recipe/RecipeHeaderCard.vue';
import IngredientsCard from '@/components/recipe/IngredientsCard.vue';
import InstructionsCard from '@/components/recipe/InstructionsCard.vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const recipeStore = useRecipeStore();
const { recipe, lastEaten, lastEatenToday } = storeToRefs(recipeStore);
const route = useRoute();

onMounted(() => {
  recipeStore.getRecipe(route.params.recipeId as string);
});

// Set the image
useSetRecipeImage(recipe);

// Delete recipe
const deleteRecipeOpen = ref<boolean>(false);
</script>
