<template>
  <main v-if="recipe.name" class="recipe">
    <article class="row">
      <div class="column left">
        <RecipeHeaderCard v-model:delete-open="deleteRecipeOpen" />
        <IngredientsCard />
      </div>
      <div class="column right">
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
    @confirm="deleteRecipe(recipe.id)"
  />
</template>

<script setup lang="ts">
import { useSetRecipeImage } from '@/composables/useManageImage';
import { ref } from 'vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import TimerCard from '@/components/recipe/TimerCard.vue';
import { useRecipe } from '@/composables/useRecipe';
import { deleteRecipe } from '@/utils/recipe/deleteRecipe';
import RecipeHeaderCard from '@/components/recipe/RecipeHeaderCard.vue';
import IngredientsCard from '@/components/recipe/IngredientsCard.vue';
import InstructionsCard from '@/components/recipe/InstructionsCard.vue';

const { recipe } = useRecipe();

// Set the image
useSetRecipeImage(recipe);

// Delete recipe
const deleteRecipeOpen = ref<boolean>(false);
</script>
