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
        <NewRecipe
          v-model:recipe="recipe"
          v-model:cook-groups="cookGroups"
          v-model:cook-group-recipe="cookGroupRecipe"
          v-model:image="image"
          v-model:error-message="errorMessage"
        />
        <Button @click.prevent="saveRecipe" id="save" :type="ButtonType.SUBMIT">
          {{ $t('editRecipePage.save') }}
        </Button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/edit recipe/NewRecipe.vue';
import Button from '@/components/form/Button.vue';
import { useEditRecipe } from '@/composables/useEditRecipe';
import { ButtonType } from '@/utils/types/enums';

const { recipe, cookGroups, cookGroupRecipe, image, errorMessage, saveRecipe } = useEditRecipe();
</script>
