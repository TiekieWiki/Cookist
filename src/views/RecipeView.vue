<template>
  <main v-if="recipe.name">
    <RecipeHeaderCard v-model:delete-open="deleteRecipeOpen" />
    <TimerCard />
    <IngredientsCard />
    <InstructionsCard />
  </main>
  <main v-else>
    <article>
      <section>
        <h2>{{ $t('recipePage.recipeNotFound') }}</h2>
      </section>
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
import { updateIngredientUnit } from '@/utils/recipe/updateIngredientUnit';
import { useRecipe } from '@/composables/useRecipe';
import { deleteRecipe } from '@/utils/recipe/deleteRecipe';
import RecipeHeaderCard from '@/components/recipe/RecipeHeaderCard.vue';
import IngredientsCard from '@/components/recipe/IngredientsCard.vue';
import InstructionsCard from '@/components/recipe/InstructionsCard.vue';

const { recipe, initialIngredients, portionCount } = useRecipe();

// Set the image
useSetRecipeImage(recipe);

/**
 * Update the ingredient unit
 */
function changeIngredientUnit(): void {
  recipe.value.ingredients = updateIngredientUnit(
    initialIngredients,
    recipe.value.ingredients,
    recipe.value.portions,
    portionCount.value
  );
}

// Delete recipe
const deleteRecipeOpen = ref<boolean>(false);
</script>
